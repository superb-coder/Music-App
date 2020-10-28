export const LANGUAGE_TYPE = [
    { label: "Instrumental", value: "Instrumental" },
    { label: "French", value: "French" },
    { label: "English", value: "English" },
    { label: "Bambara", value: "Bambara" },
    { label: "Dutch", value: "Dutch" },
    { label: "Italian", value: "Italian" },
    { label: "Portugeuse", value: "Portugeuse" },
    { label: "Spanish", value: "Spanish" },
    { label: "Arabic", value: "Arabic" },
    { label: "Lingala", value: "Lingala" },
    { label: "Malagasy", value: "Malagasy" },
    { label: "Swahili", value: "Swahili" },
    { label: "Twi", value: "Twi" },
    { label: "Wolof", value: "Wolof" },
    { label: "Xhosa", value: "Xhosa" },
    { label: "Yoruba", value: "Yoruba" },
    { label: "Zulu", value: "Zulu" },
]
  
export const GENRE = [
    { label: "HIPHOP", value: "HIPHOP" },
    { label: "POP", value: "POP" },
    { label: "POP - R&B", value: "POP - R&B" },
    { label: "R&B", value: "R&B" },
    { label: "R&B - HIPHOP", value: "R&B - HIPHOP" },
    { label: "REGAE", value: "REGAE" },
    { label: "REGAE - DANCEHALL", value: "REGAE - DANCEHALL" },
    { label: "WORLD - AFRICAN", value: "WORLD - AFRICAN" },
    { label: "OTHER", value: "OTHER" },
    { label: "AFROBEAT", value: "Afrobeat" },
    { label: "DANCEHALL", value: "Dancehall" },
]

export const TRACK_ORIGIN = [
    {
        label: "Original", value: "Original"
    },
    {
        label: "Cover", value: "Cover"
    },
    {
        label: "Remix", value: "Remix"
    }
]

let s3Options = {
    keyPrefix: "",
    bucket: "jaiye-s3",
    region: "eu-west-3",
    accessKey: "AKIAIZIWMMO3OOXZKTIA",
    secretKey: "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",
    successActionStatus: 201
}

export const S3URL = "https://s3.eu-west-3.amazonaws.com/jaiye-s3/";

export const S3_CREDENTIALS = s3Options as {
    keyPrefix: string,
    bucket: string,
    region: string,
    accessKey: string,
    secretKey: string,
    successActionStatus: number,
}