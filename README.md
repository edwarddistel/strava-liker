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
- Then run `docker run strava-liker`

I then run this as a `cron` job on my server, logging any output to a text file.