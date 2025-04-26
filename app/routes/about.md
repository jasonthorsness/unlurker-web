# Unlurker is a view of active discussions on Hacker News.

Unlurker is meant to help lurkers like me find active discussions to participate in. Its existence
should remind me to stop lurking. But so far, instead of commenting on Hacker News I have been
building Unlurker. So perhaps it doesn't work.

It displays discussions for stories younger than `max-age` where at least `min-by` unique users
contributed within `window`.

This site is not affiliated with [news.ycombinator.com](https://news.ycombinator.com). It consumes
the generous [Hacker News API](https://github.com/HackerNews/API).

## What are some interesting ways to use Unlurker other than the default settings?

To find fresh discussions just getting started, try something like
[2/2h/30m](https://hn.unlurker.com?min-by=2&max-age=2h&window=30m&user=1).

People still comment on really old stories! Scroll to the bottom of
[1/72h/120m](https://hn.unlurker.com?min-by=1&max-age=72h&window=120m&user=1).

## How does it work?

The [Unlurker Frontend](https://github.com/jasonthorsness/unlurker-web) is a small
[React Router](https://reactrouter.com/) app. The instance at
[hn.unlurker.com](https://hn.unlurker.com) is deployed to [Vercel](https://vercel.com/). To retrieve
data to render a page it makes an API call to the Unlurker Backend.

The [Unlurker Backend](https://github.com/jasonthorsness/unlurker-web-backend) is a small
[Go Gin](https://gin-gonic.com/) application. It exposes an API to retrieve active discussions. The
instance backing this site is deployed on a 2 vCPU VPS which also backs a few of my other projects.
It leverages the Unlurker package.

The [Unlurker Package](https://github.com/jasonthorsness/unlurker) is a _dramatically
overengineered_ client for the [Hacker News API](https://github.com/HackerNews/API). It provides
methods to efficiently retrieve stories and comments. In its default mode, it provides a local
Sqlite-based cache of items to reduce load on the API.

All of the Unlurker projects are MIT licensed; feel free to use them for your own unlurking-related
needs.

## Is there a command-line version?

What a strange question! The answer is yes. Install `unl` from
[here](https://github.com/jasonthorsness/unlurker) to unlurk straight from your terminal.

## Terms and Privacy

In an excuse to link to my personal blog: [unlurker.com](https://hn.unlurker.com) is covered by the
[terms](https://www.jasonthorsness.com/terms) and
[privacy policy](https://www.jasonthorsness.com/privacy) posted
[there](https://www.jasonthorsness.com).

## Thanks For Stopping By!
