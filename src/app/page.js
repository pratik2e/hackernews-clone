"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Container, Text } from "@radix-ui/themes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";

const Page = () => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const storiesPerPage = 30;

  useEffect(() => {
    setLoading(true);
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;

    const hackerNewsTopStoriesURL =
      "https://hacker-news.firebaseio.com/v0/topstories.json";

    // Fetching top stories
    axios
      .get(hackerNewsTopStoriesURL)
      .then((response) => {
        // Handle successful response
        const topStoryIds = response.data; // Array of top story IDs

        // Let's just display the IDs of the first 30 stories
        const currentStories = topStoryIds.slice(startIndex, endIndex);

        // Now, fetch details for each story and store them in state
        const storyPromises = currentStories.map((storyId) =>
          axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
          )
        );

        Promise.all(storyPromises)
          .then((storiesData) => {
            // Handle successful story details responses
            const storiesDetails = storiesData.map((story, index) => {
              const { id, by: author, time, title, url } = story.data;
              return {
                id,
                author,
                time,
                title,
                url,
                index: index + startIndex + 1,
              };
            });
            setStories(storiesDetails);
            setLoading(false);
          })
          .catch((error) => {
            // Handle error fetching story details
            console.error("Error fetching story details:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        // Handle error fetching top stories
        console.error("Error fetching top stories:", error);
        setLoading(false);
      });
  }, [currentPage, storiesPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      <Box
        style={{
          background: "var(--gray-a2)",
          borderRadius: "var(--radius-3)",
        }}
      >
        <Container size="3">
        {loading && <Progress  value={100} />}
        {!loading &&
          stories.map((story) => (
            <div key={story.id} className="space-y-2 rounded-md p-4 py-4">
              
                <p className="text-lg font-bold">{"Sr. No: " + story.index}</p>
                <Text
                  as="div"
                  size="3"
                  weight="bold"
                  className="text-lg font-bold mb-2"
                >
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
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
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious onClick={handlePreviousPage} />
            <PaginationLink>{currentPage}</PaginationLink>
            <PaginationEllipsis />
            <PaginationNext onClick={handleNextPage} />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Page;
