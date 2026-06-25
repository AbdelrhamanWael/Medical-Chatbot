# MediChat AI - Full-Stack Medical Chatbot

A production-ready full-stack Medical Chatbot built using a Python/Flask backend and a modern React/Vite frontend. It uses Langchain, HuggingFace Embeddings, Pinecone Vector Database, and Google's Generative AI (Gemini) to perform Retrieval-Augmented Generation (RAG) based on medical documents.

---

## 🎨 Features
- **Modern UI**: Built with React, Tailwind CSS v4, and Framer Motion for smooth animations and a premium dark-mode aesthetic.
- **RAG Pipeline**: Retrieves relevant medical context from uploaded PDFs using Pinecone and provides accurate, conversational answers using Langchain and Google Gemini.
- **Robust Backend**: Flask REST API providing seamless connection between the web interface and the AI engine.

## 🏗 Architecture

- **Frontend**: A React SPA created with Vite. It handles user input, displays the chat history, and sends API requests using Axios. Uses `lucide-react` for iconography and Tailwind CSS for rapid, beautiful styling.
- **Backend**: Flask application (`app.py`) providing a `/api/chat` POST endpoint.
- **AI/ML Layer**:
  - `langchain-google-genai` for the LLM (`gemini-2.5-pro`).
  - `langchain-huggingface` for sentence embeddings (`sentence-transformers/all-MiniLM-L6-v2`).
  - `pinecone` for vector database storage and retrieval.

---

## 📓 Breakdown of `research/trials.ipynb`

During the development of this project, a Jupyter notebook (`trials.ipynb`) was used as a scratchpad to iteratively build and test the RAG pipeline. Here is a thorough breakdown of its cells and their purpose:

### Data Ingestion and Splitting
- **Imports & `load_pdf_files`**: Uses `PyPDFLoader` and `DirectoryLoader` to bulk load all PDF files situated in the `data/` directory. This is the first step to parse unstructured medical data.
- **`filter_to_minimal_docs`**: Cleans the loaded documents to retain only essential text and minimal metadata (e.g., source file), reducing overhead.
- **`text_split`**: Uses Langchain's `RecursiveCharacterTextSplitter` to divide massive documents into manageable chunks (500 characters, overlap of 20). This ensures the context window of the LLM isn't exceeded during retrieval.

### Embedding and Vectorization Tests
- **`HuggingFaceEmbeddings`**: Initializes the HuggingFace model (`all-MiniLM-L6-v2`) locally to convert chunks into dense vector representations.
- **`embed_query` tests**: Small test cells generating an embedding for "Hello world" and printing its vector length (typically 384 dimensions for this model) to verify that the local embedding model is loaded correctly.

### Database Connection and Retrieval
- **Environment Setup**: Uses `python-dotenv` to load API keys securely (`PINECONE_API_KEY`, `Google_API_KEY`).
- **Pinecone Setup**: Connects to Pinecone and initializes the `medical-chatbot` index.
- **`PineconeVectorStore`**: Integrates Langchain with Pinecone for similarity searches. 
- **Document Addition Test**: Shows adding a dummy `Document` ("dswithbappy...") to the index to ensure write operations work.
- **Retrieval Test**: Converts the vector store to a retriever and performs a test query (`"what is the Ance ? "`) to see if the engine fetches the correct chunks.

### RAG Chain Generation
- **Chain Imports**: Imports `create_retrieval_chain` and `create_stuff_documents_chain` to link the retriever with the LLM.
- **`system_prompt`**: Sets the persona and instructions for the Medical Assistant.
- **Execution (`rag_chain.invoke`)**: The final test cell feeding a complex medical question ("what is Acromegaly and gigantism?") through the entire pipeline and printing the generated answer. This proved the architecture before porting the logic to `app.py`.

---

## 🚀 Setup and Installation

### Prerequisites
- Python 3.11 or 3.12 (Highly Recommended)
- Node.js 18+
- Pinecone Account & API Key
- Google Gemini API Key

### Backend Setup
1. Clone the repository and navigate to the project root.
2. Ensure you have the `.env` file in the root containing:
   ```env
   PINECONE_API_KEY=your_pinecone_api_key
   Google_API_KEY=your_google_genai_api_key
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   *The backend will run on `http://localhost:5000`.*

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. Open it in your browser to interact with the chatbot.*

---

## 💡 Usage

Once both servers are running:
1. Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2. Type a medical question into the chat input box (e.g., "What are the symptoms of gigantism?").
3. The UI will display a typing indicator while the Flask backend securely queries the Pinecone vector database.
4. The backend synthesizes the retrieved medical context using Google Gemini and streams the response back to your screen.

---

## 📦 Dependencies

**Backend:**
- `Flask` & `Flask-Cors` - API and Cross-Origin Resource Sharing.
- `langchain`, `langchain-google-genai`, `langchain-pinecone` - RAG pipeline framework.
- `sentence-transformers` & `transformers` - Local dense vector embedding models.
- `pinecone-client` - Vector database client.

**Frontend:**
- `React` & `Vite` - UI Framework and fast bundler.
- `Tailwind CSS v4` - Utility-first styling toolkit.
- `framer-motion` - Production-ready animation library.
- `lucide-react` - Beautiful, consistent iconography.

---

## 📁 File Structure
- `app.py` - Main Flask Application server.
- `store_index.py` - Script to process `data/` and push embeddings to Pinecone index.
- `src/` - Helper modules for embeddings and prompts.
- `frontend/` - React/Vite Source code for the UI.
- `research/trials.ipynb` - Jupyter notebook mapping out the pipeline.
- `data/` - Directory to store medical PDFs for processing.

---

## 🤝 Contributing Guidelines

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact / Support

If you have any questions, encounter any issues, or want to suggest new features:
- **Open an issue** on GitHub.
- Make sure to describe your environment (Python version, Node version) and include any relevant traceback logs from the Flask backend.