import {
    date,
    serial,
    pgEnum,
    pgSchema,
    pgTable,
    uuid,
    text,
    integer,
    primaryKey,
    boolean,
    timestamp,
    smallint,
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
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    gender: genderEnum('gender').notNull(),
    dob: date('dob'),
    newslettersEnabled: boolean('newsletters_enabled').default(true),
})

export const collectionsTable = pgTable('collections', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    descrption: text('description').default(''),
    bannerType: assetEnum('banner_type').default('IMAGE'),
    accentColor: text('accent_color').default('#eeeeee'),
})

export const productsTable = pgTable('products', {
    id: serial('id').primaryKey(),
    collectionId: integer('collection_id').references(() => collectionsTable.id),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    washGuide: text('washGuide').notNull(),
    details: text('details').notNull(),
})

export const itemsTable = pgTable('items', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => productsTable.id),
    sku: text('sku').notNull(),
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
    title: text('title').notNull(),
    pincode: integer('pincode').notNull(),
    state: text('state').notNull(),
    city: text('city').notNull(),
    lineOne: text('line_one').notNull(),
    lineTwo: text('line_two').default(''),
    phone: text('phone').notNull(),
    optionalPhone: text('optional_phone'),
})

export const reviewsTable = pgTable('reviews', {
    id: serial('id').primaryKey(),
    accountId: uuid('account_id')
        .references(() => accountsTable.id, { onDelete: 'cascade' })
        .notNull(),
    productId: uuid('product_id')
        .references(() => productsTable.id)
        .notNull(),
    content: text('content').notNull(),
    rating: smallint('rating').notNull(),
    postedAt: timestamp('postedAt').defaultNow(),
})

export const wishlistTable = pgTable(
    'wishlist',
    {
        accountId: uuid('account_id').references(() => accountsTable.id),
        collectionId: integer('collection_id').references(() => collectionsTable.id),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.accountId, table.collectionId] }),
    })
)
