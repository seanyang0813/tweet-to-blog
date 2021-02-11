import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import needle from "needle";
import Card from "../components/card";

export default function Process({ tweets }) {
  const [session, loading] = useSession();
  //preprocess to find ones with conversation mapping
  const [conversationMapping, setConversationMapping] = useState({});
  const [minConversation, setMinConversation] = useState(0);
  const [trailingFilter, setTrailingFilter] = useState("");
  const [filteredThreads, setFilteredThreads] = useState([]);

  useEffect(() => {
    //create mapping of conversation id based on the tweets
    const ret = {};
    const filtered = [];
    for (const tweet of tweets) {
      //add to return object if there there is not conversation id
      if (ret[tweet.conversation_id] == null) {
        ret[tweet.conversation_id] = [tweet];
      } else {
        ret[tweet.conversation_id].unshift(tweet);
      }
    }
    //find longest chain in conversation and earliest to see
    for (const thread of Object.values(ret)) {
      if (thread.length >= minConversation) {
        filtered.push(thread);
      }
    }
    setConversationMapping(ret);
    setFilteredThreads(filtered);
  }, [tweets, minConversation]);

  return (
    <>
      {filteredThreads.map((thread) => {
        return <Card key={thread[0].conversation_id} thread={thread}></Card>;
      })}
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  if (session == null) {
    return {
      props: {
        tweets: [],
      },
    };
  }
  const userId = session.user.id;
  var tweets = [];
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  const bearerToken = process.env.BEARER_TOKEN;
  const getUserTweets = async () => {
    let params = {
      max_results: 100,
      exclude: "retweets",
      "tweet.fields": "conversation_id,created_at",
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
