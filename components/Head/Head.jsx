import NextHead from "next/head";

function Head({ title }) {
    return (
        <NextHead>
            <title>{title}</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </NextHead>
    )
}

export default Head;