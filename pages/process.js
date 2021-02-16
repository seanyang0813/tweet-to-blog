import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import needle from "needle";
import Card from "../components/card";
import FilterAccordion from "../components/filterAccordion";

export default function Process({ tweets }) {
  const [session, loading] = useSession();
  //preprocess to find ones with conversation mapping
  const [conversationMapping, setConversationMapping] = useState({});
  const [minConversation, setMinConversation] = useState(0);
  const [regexFilters, setRegexFilters] = useState([
    "^\\d+\\/",
    "\\(\\d+\\/\\d+\\)$",
  ]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [seperateBy, setSeperateBy] = useState(" ");

  //find the longest chain within thread by looking at reply to
  function findLongestChain(thread) {
    let maxLength = 0;
    let curThread = null;
    let mapping = {};
    let idToTweet = {};
    //find the chain by checking length we can use dp with chronological order
    for (const tweet of thread) {
      idToTweet[tweet.id] = tweet;
      if (tweet.referenced_tweets == undefined) {
        mapping[tweet.id] = 1;
      } else {
        //retrieve the replied to id
        let replyToId = tweet.referenced_tweets[0].id;
        //the number of thread is replied to plus 1
        if (mapping[replyToId] != null) {
          mapping[tweet.id] = mapping[replyToId] + 1;
        } else {
          //should never happen in normal thread
          mapping[tweet.id] = 1;
        }
      }
      //find the current mapping length and if it's > longest use it
      let curLength = mapping[tweet.id];
      //set current to the current tweet if it's longest
      if (curLength > maxLength) {
        curThread = tweet;
        maxLength = curLength;
      }
    }
    //find the max length and follow the threads to create a return object
    let result = [];
    //iterate with cur thread until there is nothing reply to
    while (
      curThread.referenced_tweets != undefined &&
      idToTweet[curThread.referenced_tweets[0].id] != null
    ) {
      result.unshift(curThread);
      curThread = idToTweet[curThread.referenced_tweets[0].id];
    }
    //we doen with all but last one so we unshift that
    result.unshift(curThread);
    return result;
  }

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
        //first process the thread to find the longest one
        //process the thread using the regex to remove
        let curThread = [];
        let longestThread = findLongestChain(thread);
        //process the text of individual text
        longestThread.forEach((post) => {
          let filteredText = post.text;
          //use regex to process characters
          for (const reText of regexFilters) {
            var re = new RegExp(reText, "i");
            filteredText = filteredText.replace(re, "");
          }
          filteredText = filteredText + "\n";
          curThread.push({ ...post, text: filteredText });
        });
        filtered.push(curThread);
      }
    }
    setConversationMapping(ret);
    setFilteredThreads(filtered);
  }, [tweets, minConversation]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "50rem" }}>
          <FilterAccordion></FilterAccordion>
          {filteredThreads.map((thread) => {
            return (
              <Card key={thread[0].conversation_id} thread={thread}></Card>
            );
          })}
        </div>
      </div>
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
      "tweet.fields": "conversation_id,created_at,referenced_tweets",
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
