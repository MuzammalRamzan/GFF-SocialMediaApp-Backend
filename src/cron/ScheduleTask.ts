import { CronJob } from 'cron'

export class ScheduleTask {
	private crontab: string
	private callback: () => Promise<void>
	private tz = 'utc';

	constructor(crontab: string, callback: () => Promise<void>, tz?: string) {
		this.crontab = crontab
		this.callback = callback

		if (tz) {
			this.tz = tz
		}
	}

	public run() {
		const job = new CronJob(this.crontab, this.callback, null, true, this.tz)

		job.start()
	}
}
