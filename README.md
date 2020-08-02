# Strava Liker

This is just a small, fun side project to automatically "like" your friends' activities on Strava without actually having to click the "like" button on them.

I follow a lot of people and it can be a lot of clicking to like everyone's daily workouts, but I want to support them. Hence this quick, simple script that to automate it for me.

## How it works

- `git clone` this directory
- Update `.env` with your Strava username and password
- Run `npm install`
- Run `node strava.js`

## Automating this in the background

I run a NAS and wanted it to do this for me, instead of having my personal or work laptops run this in the background all the time.

But it has a special flavor of Debian that doesn't like Puppeteer (aka headless Chrome) so I created a Dockerfile for it so it can run in there.

To run via Docker:
- Install Docker on your server/machine
- In the repo run `docker build -t strava-liker .`

And you're done. There is a built-in cron job inside the container that will run the app every hour on the hour.

If you want logging you can log to a file in the container, and then create a separate cron job outside the container to copy the file out of there, or you can change the `CMD` command in the `Dockerfile` to `CMD ["node", "strava.js"]` and then a cron job to `docker run` the image and output that to a log.