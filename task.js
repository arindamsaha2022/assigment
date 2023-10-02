const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const app = express();
const PORT = 3000; 

//route at `/api/blog-stats`.
app.get('/api/blog-stats', async (req, res) => {
  try {
    
    const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

    const response = await axios.get(apiUrl, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    });

    const blogData = response.data 
    const blogs= blogData.blogs
    const totalBlogs = _.size(blogs);
    const longestTitleBlog = _.maxBy(blogs, 'title.length');
    const uniqueBlogTitles = _.uniqBy(blogs, 'title');// This is the array of unique blog titles

   const privacyBlogs = _.filter(blogs, (blog) =>
   _.includes(_.toLower(blog.title), 'privacy')
   );
   const privacyBlogsCount = privacyBlogs.length
   const uniqueBlogTitlesCount = uniqueBlogTitles.length
   const statistics = {
    totalBlogs,
    longestBlogTitle: longestTitleBlog.title,
    privacyBlogsCount,
    uniqueBlogTitlesCount,
    uniqueBlogTitles 
  };
   
    res.json({
    statistics
    } );
    console.log(
      totalBlogs,
      longestTitleBlog.title,
      privacyBlogsCount,
      uniqueBlogTitlesCount, 
    )

    // res.json(blogData);
    // console.log(blogData)

  } catch (error) {
    // Handle errors if the request fails
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blog data' });
  }
});


// Create a route at /api/blog-search
app.get('/api/blog-search', async (req, res) => {
  try {
   
    const searchQuery = req.query.query;

    if (!searchQuery) {

      return res.status(400).json({ error: 'Search query is required' });
    }

    const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

    const response = await axios.get(apiUrl, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    });

    const blogData = response.data.blogs;

    // Filter the blogs based on the search query (case-insensitive)
   const matchingBlogs = blogData.filter((blog)=>
     blog.title.toLowerCase().includes(searchQuery.toLowerCase())

   )

    res.json(matchingBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or process blog data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port=> http://localhost:${PORT}`);
});

