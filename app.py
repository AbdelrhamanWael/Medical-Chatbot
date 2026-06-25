from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

from src.helper import download_embeddings
from src.prompt import system_prompt

app = Flask(__name__)
# Enable CORS for all routes so the frontend can communicate with the backend
CORS(app)

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('Google_API_KEY') or os.environ.get('GOOGLE_API_KEY')

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
if GOOGLE_API_KEY:
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize embeddings and Pinecone vector store
print("Initializing embeddings and Pinecone vector store...")
embeddings = download_embeddings()

index_name = "medical-chatbot"
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(index_name)

docsearch = PineconeVectorStore(
    index=index,
    embedding=embeddings,
    text_key="text"
)

# Initialize the Retriever
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

# Initialize the LLM (Google GenAI)
print("Initializing LLM...")
llm = GoogleGenerativeAI(
    model="gemini-2.5-flash", 
    google_api_key=GOOGLE_API_KEY
)

# Create the Chat Prompt Template from the system prompt in src/prompt.py
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

# Setup RAG chain
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Expects JSON: { "message": "user's query here" }
    Returns JSON: { "response": "chatbot's answer here" }
    """
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "No message provided."}), 400

        user_message = data["message"]
        print(f"Received message: {user_message}")

        # Invoke the Langchain RAG chain
        response = rag_chain.invoke({"input": user_message})
        
        answer = response.get("answer", "I am sorry, I couldn't generate a response.")
        
        return jsonify({
            "response": answer
        })

    except Exception as e:
        print(f"Error during chat processing: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500


if __name__ == '__main__':
    # Run the Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
