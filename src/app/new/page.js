"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Box,Text,Container } from "@radix-ui/themes";
import { Progress } from "@/components/ui/progress";
const Page = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const hackerNewsURL =
      "https://hacker-news.firebaseio.com/v0/newstories.json";

    axios
      .get(hackerNewsURL)
      .then((response) => {
        const storyIds = response.data.slice(0, 30); // Fetching 30 stories for demonstration

        // Fetch details for each story
        const storyPromises = storyIds.map((storyId) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
          )
        );

        Promise.all(storyPromises)
          .then((storiesData) => {
            const storiesDetails = storiesData.map((story, index) => ({
              id: story.data.id,
              author: story.data.by,
              time: story.data.time,
              title: story.data.title,
              url: story.data.url,
              index: index + 1,
            }));
            setStories(storiesDetails);
          })
          .catch((error) => {
            console.error("Error fetching story details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching new stories:", error);
      });
  }, []);

  return (
    <div>
      <Box>
      <Container size="3">
      { <Progress  value={100} />}
        {stories.map((story) => (
          <div key={story.id} className="space-y-2 rounded-md p-4 py-4">
            
            <p className="text-lg font-bold">{'Sr. No: ' + story.index}</p>
              <Text
                as="div"
                size="3"
                weight="bold"
                className="text-lg font-bold mb-2"
              ><a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
              </Text>
              <p>{new Date(story.time * 1000).toLocaleString()}</p>
              <p>{story.author}</p>
              <p>
                 <a href={story.url} target="_blank" rel="noopener noreferrer">
                 {story.url}
               </a>
              </p>
              <hr />
            
          </div>
        ))}
        </Container>
      </Box>
    </div>
  );
};

export default Page;
