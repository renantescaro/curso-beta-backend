
CREATE TABLE IF NOT EXISTS public.categories
(
    id integer NOT NULL DEFAULT,
    name character varying(255),
    description character varying(255),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.products
(
    id integer NOT NULL DEFAULT,
    title character varying(255),
    description text,
    brand character varying(200),
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.products_categories
(
    id integer NOT NULL DEFAULT,
    product_id integer,
    category_id integer,
    CONSTRAINT products_categories_pkey PRIMARY KEY (id),
    CONSTRAINT products_categories_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT products_categories_product_id_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
