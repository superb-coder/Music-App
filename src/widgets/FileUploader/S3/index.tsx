import FileUploadInterface from './FileUploadInterface';
import { RNS3 } from 'react-native-s3-upload';
/**
 * AWSCognito
 */
export default class S3FileUploader implements FileUploadInterface {
	/**
	   * put function params
	   * 
	   * file params
	   * @param file.uri
	   * @param file.name
	   * @param file.type
	   * 
	   * options params
	   * @param options.keyPrefix
	   * @param options.bucket
	   * @param options.region
	   * @param options.accessKey
	   * @param options.secretKey
	   * @param options.successActionStatus
	   * 
	   */
	public async put(
		file: {
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
		}
	) {
		return new Promise((resolve, reject) => {
			RNS3.put(file, options).then((data) => {
				resolve(data);
			}, (error) => {
				resolve(error);
			});
		})
	}
}