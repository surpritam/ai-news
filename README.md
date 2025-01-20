# **AI Daily Digest**

AI Daily Digest is a **React** application designed to fetch and display AI-related news articles. The app categorizes news based on professional fields, allowing users to filter articles for their specific interests. With a responsive and clean design, it works seamlessly across mobile and desktop devices.

---

## **Features**

1. **AI News Fetching**
   - Uses the [NewsAPI](https://newsapi.org/) to fetch AI-related news articles.
   - Articles are categorized based on predefined professions or interests.

2. **Article Categorization**
   - Categories include:
     - Healthcare
     - Finance
     - Education
     - Engineering
     - Marketing
     - Law
     - Human Resources
     - Sports
     - Gaming
     - Manufacturing
     - Transportation
     - Journalism
     - Other

3. **Local Caching**
   - Caches news articles in **localStorage** for 1 hour to improve performance and reduce API calls.

4. **Responsive Design**
   - Built with **Material-UI** for a mobile-first, fully responsive user interface.
   - Displays a single column on smaller screens and a grid layout on larger screens.

5. **Dynamic Features**
   - Articles are sorted by **publish date** (latest first).
   - Displays article images, titles, descriptions, sources, and published dates.

6. **Category Filtering**
   - Users can filter articles by profession or interest using a dropdown selector.

---

## **Getting Started**

### **Prerequisites**

- **Node.js**: v14 or higher (LTS recommended)
- **npm**: v6 or higher (or **yarn** v1+)
- A valid [NewsAPI](https://newsapi.org/) API Key

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/surpritam/ai-news.git
   cd ai-news
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your NewsAPI key:
   ` REACT_APP_NEWSAPI_KEY=your_newsapi_key_here `
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser and visit
   ```bash
   http://localhost:3000
   ```

## **Usage**
1. Select a category from the dropdown menu (e.g., Healthcare, Finance, Technology).
2. View AI news articles tailored to the selected category.
3. Click on "Read More" to access the full article on the original publisher's site.

## **Technologies Used**
* React: Frontend framework
* Material-UI: Component library for responsive UI
* Axios: HTTP client for API requests
* NewsAPI: External news source API
* localStorage: Browser storage for caching articles

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgments

- [NewsAPI](https://newsapi.org/) for providing the news data.
- [Material-UI](https://mui.com/) for the UI components.
- The open-source community for making projects like this possible.