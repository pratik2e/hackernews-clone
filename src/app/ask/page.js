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

const Page = ({ storyType }) => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 30;

  useEffect(() => {
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;

    const hackerNewsAskStoriesURL =
    "https://hacker-news.firebaseio.com/v0/askstories.json";


    axios
      .get(hackerNewsAskStoriesURL)
      .then((response) => {
        const storyIds = response.data;

        const currentStories = storyIds.slice(startIndex, endIndex);

        const storyPromises = currentStories.map((storyId) =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
        );

        Promise.all(storyPromises)
          .then((storiesData) => {
            const storiesDetails = storiesData.map((story, index) => {
              const { id, by: author, time, title, url } = story.data;
              return { id, author, time, title, url, index: index + startIndex + 1 };
            });
            setStories(storiesDetails);
          })
          .catch((error) => {
            console.error("Error fetching story details:", error);
          });
      })
      .catch((error) => {
        console.error(`Error fetching ${storyType} stories:`, error);
      });
  }, [currentPage, storiesPerPage, storyType]);

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
        {stories.map((story) => (
          <div key={story.id} className="space-y-2 rounded-md p-4 py-4 ">
            <Container size="3">
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
            </Container>
          </div>
        ))}
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
