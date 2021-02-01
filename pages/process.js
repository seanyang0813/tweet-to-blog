import React from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import needle from "needle";
import Card from "../components/card";

export default function Process({ tweets }) {
  const [session, loading] = useSession();
  //try to check out how to use the twitter

  return <></>;
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  const userId = session.user.id;
  var tweets = [];
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  const bearerToken = process.env.BEARER_TOKEN;
  const getUserTweets = async () => {
    let params = {
      max_results: 100,
    };

    const options = {
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    };

    let hasNextPage = true;
    let nextToken = null;
    while (hasNextPage) {
      let resp = await getPage(params, options, nextToken);
      if (
        resp &&
        resp.meta &&
        resp.meta.result_count &&
        resp.meta.result_count > 0
      ) {
        if (resp.data) {
          tweets.push.apply(tweets, resp.data);
        }
        if (resp.meta.next_token) {
          nextToken = resp.meta.next_token;
          //remove when on production to save api call
          hasNextPage = false;
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }
    return tweets;
  };

  const getPage = async (params, options, nextToken) => {
    if (nextToken) {
      params.pagination_token = nextToken;
    }
    console.log(params);

    try {
      const resp = await needle("get", url, params, options);
      console.log(resp.statusCode);
      if (resp.statusCode != 200) {
        return;
      }
      return resp.body;
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }
  };

  //my code to fethc all tweets

  if (session != null) {
    //fetch all the tweets
    try {
      await getUserTweets();
    } catch (err) {
      console.log(err);
    }
  }

  return {
    props: {
      tweets,
    },
  };
}
