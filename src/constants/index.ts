export const PAGE_SIZE = 5
export const AWS_S3_BASE_BUCKET_URL =
	process.env.AWS_S3_BASE_BUCKET_URL || 'https://girls-first-finance.s3.amazonaws.com/'

export const YOTI_IDENTITY_VERIFICATION_STATE = {
	EXPIRED: 'EXPIRED',
	ONGOING: 'ONGOING',
	COMPLETED: 'COMPLETED',
	APPROVE: 'APPROVE'
};

export const YOTI_IDENTITY_VERIFICATION_STATUS = {
	DONE: 'DONE',
	PENDING: 'PENDING'
}