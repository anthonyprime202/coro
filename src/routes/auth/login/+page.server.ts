import z from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { fail } from '@sveltejs/kit'

// VALIDATORS 

const stepOneValidator = z.object({
    email: z.string().email().min(20, "The email should be longer")
})

const stepTwoValidator = z.object({
    email: z.string().email().min(20, "The email should be longer"),
    otp: z.number().min(6, "The OTP has to be 6 digits").max(6, "The OTP has to be 6 digits")
})

// LOAD 

export const load: PageServerLoad = async () => {
    const stepOneForm = await superValidate(zod(stepOneValidator))
    const stepTwoForm = await superValidate(zod(stepTwoValidator))

    return { stepOneForm, stepTwoForm }
}

// ACTIONS

export const actions: Actions = {
    verify: async ({ request }) => {
        const form = await superValidate(request, zod(stepOneValidator))
        if (form.errors) {
            return fail(406, { stepOneForm: form })
        }
        return { stepOneForm: form }
    },
    login: async ({ request }) => {
        const form = await superValidate(request, zod(stepTwoValidator))
        console.log(form)
        if (form.errors) {
            return fail(406, { stepTwoForm: form })
        }
        return { stepTwoForm: form }
    },
}
