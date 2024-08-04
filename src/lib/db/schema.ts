import {
    date,
    serial,
    pgEnum,
    pgSchema,
    pgTable,
    uuid,
    varchar,
    integer,
    primaryKey,
    boolean,
} from 'drizzle-orm/pg-core'

export const genderEnum = pgEnum('genders_enum', ['MALE', 'FEMALE', 'OTHERS'])
export const assetEnum = pgEnum('assets_enum', ['IMAGE', 'VIDEO'])
export const sizeEnum = pgEnum('size_enum', ['S', 'M', 'X', 'XL'])

export const authSchema = pgSchema('auth')
export const usersTable = authSchema.table('users', {
    id: uuid('id').primaryKey(),
})

export const accountsTable = pgTable('accounts', {
    id: uuid('id')
        .primaryKey()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    firstName: varchar('first_name', { length: 63 }).notNull(),
    lastName: varchar('last_name', { length: 63 }).notNull(),
    gender: genderEnum('gender').notNull(),
    dob: date('dob'),
    newslettersEnabled: boolean('newsletters_enabled').default(true),
})

export const collectionsTable = pgTable('collections', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 63 }).notNull(),
    descrption: varchar('description', { length: 255 }).default(''),
    bannerType: assetEnum('banner_type').default('IMAGE'),
    accentColor: varchar('accent_color', { length: 7 }).default('#eeeeee'),
})

export const productsTable = pgTable('products', {
    id: serial('id').primaryKey(),
    collectionId: integer('collection_id').references(() => collectionsTable.id),
    name: varchar('name', { length: 63 }).notNull(),
    price: integer('price').notNull(),
    washGuide: varchar('washGuide', { length: 255 }).notNull(),
    details: varchar('details', { length: 255 }).notNull(),
})

export const itemsTable = pgTable('items', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => productsTable.id),
    sku: varchar('sku', { length: 255 }).notNull(),
    size: sizeEnum('size').notNull(),
    stock: integer('stock').default(0),
})

export const cartItemsTable = pgTable(
    'cart_items',
    {
        accountId: uuid('account_id')
            .references(() => accountsTable.id, { onDelete: 'cascade' })
            .notNull(),
        itemId: integer('item_id')
            .references(() => itemsTable.id)
            .notNull(),
        quantity: integer('quantity').default(1),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.accountId, table.itemId] }),
    })
)

export const addressesTable = pgTable('adresses', {
    id: serial('id').primaryKey(),
    accountId: uuid('account_id').references(() => accountsTable.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 63 }).notNull(),
    pincode: integer('pincode').notNull(),
    state: varchar('state', { length: 63 }).notNull(),
    city: varchar('city', { length: 63 }).notNull(),
    lineOne: varchar('line_one', { length: 255 }).default(''),
    lineTwo: varchar('line_two', { length: 255 }).default(''),
    defaultAddress: boolean('default_address').default(false),
})
