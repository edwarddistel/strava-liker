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
- Then `docker run -d strava-liker`

And you're done. There is a built-in cron job inside the container that will run the app every hour on the hour.

The Docker container will produce a log in `/usr/src/app/cron-log.txt`; you could set a cron job in your parent container to copy that down to your host, `docker cp <host ID from docker ps>:/usr/src/app/cron-log.txt /my/destination`.