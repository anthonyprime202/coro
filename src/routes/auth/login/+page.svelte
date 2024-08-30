<script lang="ts">
	/* 
	set a time of 60 seconds after with the resend button enables
	when resend button is clicked a new otp will be sent
	*/
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';

	export let data: PageData;

	let verified = false;

	// Step One Form
	const {
		form: stepOneForm,
		errors: stepOneErrors,
		enhance: stepOneEnhance
	} = superForm(data.stepOneForm, {
		onResult: ({ result }) => {
			// @ts-expect-error Idk why it says dat is not there, severe skill issue by tsserver
			if (result?.data.stepOneForm.valid) verified = true;
		}
	});

	// Step Two Form
	const {
		form: stepTwoForm,
		errors: stepTwoErrors,
		enhance: stepTwoEnhance
	} = superForm(data.stepTwoForm, {
		onSubmit: ({ formData }) => formData.set('email', $stepOneForm.email)
	});
</script>

<main>
	<SuperDebug data={$stepOneForm} />

	<div class="container">
		<header>
			<h1>CORO</h1>
			<p>Welcome Back! Please enter your email to login</p>
		</header>
		{#if !verified}
			<div class="email-step">
				<form method="POST" action="?/verify" use:stepOneEnhance>
					<div class="input__wrapper">
						<label for="email">Email</label>
						<input type="email" name="email" id="email" bind:value={$stepOneForm.email} />
						{#if $stepOneErrors.email}
							<small>{$stepOneErrors.email}</small>
						{/if}
					</div>
					<button>Log In</button>
				</form>
			</div>
		{:else}
			<div class="otp-step">
				<form method="POST" action="?/login" use:stepTwoEnhance>
					<div class="input__wrapper">
						<label for="email">Email</label>
						<input type="email" id="email" name="email" bind:value={$stepOneForm.email} disabled />
						{#if $stepTwoErrors.email}
							<small>{$stepTwoErrors.email}</small>
						{/if}
					</div>
					<div class="input__wrapper">
						<label for="opt">OTP</label>
						<input type="numer" id="otp" name="otp" bind:value={$stepTwoForm.otp} />
						{#if $stepTwoErrors.otp}
							<small>{$stepTwoErrors.otp}</small>
						{/if}
					</div>

					<button>Verify</button>
				</form>
			</div>
		{/if}
	</div>
</main>
