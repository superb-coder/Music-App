/**
 * Follow documentation https:
 */
export default interface FileUploadInterface {
    put: (file: {
        uri: string,
        name: string,
        type: string,
    }, options: {
        keyPrefix: string,
        bucket: string,
        region: string,
        accessKey: string,
        secretKey: string,
        successActionStatus: number
    }) => false | object;
}