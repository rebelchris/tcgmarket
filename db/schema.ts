import {
    boolean,
    index,
    integer,
    jsonb,
    numeric,
    pgTable,
    primaryKey,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import {AdapterAccountType} from '@auth/core/adapters';
import {SQL, sql} from 'drizzle-orm/sql';
import {relations} from "drizzle-orm";

export const users = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: timestamp('emailVerified', {mode: 'date'}),
    image: text('image'),
});

export const accounts = pgTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, {onDelete: 'cascade'}),
        type: text('type').$type<AdapterAccountType>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
);

export const sessions = pgTable('session', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, {onDelete: 'cascade'}),
    expires: timestamp('expires', {mode: 'date'}).notNull(),
});

export const verificationTokens = pgTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: timestamp('expires', {mode: 'date'}).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
);

export const authenticators = pgTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: text('userId')
            .notNull()
            .references(() => users.id, {onDelete: 'cascade'}),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: boolean('credentialBackedUp').notNull(),
        transports: text('transports'),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
);

export const tcgs = pgTable('tcgs', {
    id: varchar('id', {length: 50}).primaryKey(),
    name: varchar('name', {length: 50}).unique().notNull(), // "Pokémon", "Magic: The Gathering"
    createdAt: timestamp('created_at').defaultNow(),
    logoUrl: text('logo_url'),
    slug: text('slug').generatedAlwaysAs(
        (): SQL => sql`slugify(${tcgs.name})`,
    )
});

export const sets = pgTable('sets', {
    id: varchar('id', {length: 20}).primaryKey(), // "sv1", "ltr"
    tcgId: varchar('tcg_id').references(() => tcgs.id),
    name: varchar('name', {length: 100}).notNull(), // "Scarlet & Violet: 151", "The Lord of the Rings: Tales of Middle-earth"
    series: varchar('series', {length: 50}).notNull(), // "Sword & Shield", "The Lord of the Rings"
    printedTotal: integer('printed_total'),
    total: integer('total'),
    ptcgoid: varchar('ptcgo_code', {length: 20}),
    releaseDate: timestamp('release_date'),
    logoUrl: text('logo_url'),
    symbolUrl: text('symbol_url'),
    createdAt: timestamp('created_at').defaultNow(),
    slug: text('slug').generatedAlwaysAs(
        (): SQL => sql`slugify(${sets.name})`,
    )
});

export const cards = pgTable(
    'cards',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        tcgId: varchar('tcg_id').references(() => tcgs.id),
        setId: varchar('set_id').references(() => sets.id),
        // @ts-ignore
        name: varchar('name', {length: 255}).notNull(),
        searchName: varchar('search_name', {length: 255}).notNull(),
        tcgApiId: text('tcg_api_id'),
        number: varchar('number', {length: 20}),
        rarity: varchar('rarity', {length: 20}),
        metadata: jsonb('metadata').notNull().default({}),
        images: jsonb('images').notNull().$type<{ large?: string, small?: string }>(),
        createdAt: timestamp('created_at').defaultNow(),
        slug: text('slug').generatedAlwaysAs(
            (): SQL => sql`slugify(${cards.searchName})`,
        )
    },
    (table: SQL) => ({
        nameSearchIndex: index('name_search_index').using(
            'gin',
            sql`to_tsvector('english', ${cards.name})`
        ),
    })
);


export const userLists = pgTable('user_lists', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, {onDelete: 'cascade'}),
    name: varchar('name', {length: 100}).notNull(),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const listings = pgTable('listings', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
        .notNull()
        .references(() => users.id, {onDelete: 'cascade'}),
    cardId: text('card_id').references(() => cards.id),
    listId: text('list_id')
        .references(() => userLists.id)
        .notNull(),
    condition: text('condition').default('near_mint'),
    price: numeric('price', {precision: 12, scale: 2}).notNull(),
    quantity: integer('quantity').default(1),
    isReverse: boolean('is_reverse').default(false),
    isSigned: boolean('is_signed').default(false),
    isFirstEdition: boolean('is_first_edition').default(false),
    isAltered: boolean('is_altered').default(false),
    language: varchar('language', {length: 20}).default('English'),
    notes: text('notes'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const cardsRelations = relations(cards, ({one}) => ({
    set: one(sets, {fields: [cards.setId], references: [sets.id]}),
}));
