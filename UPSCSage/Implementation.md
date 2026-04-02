1. Product Overview
The Problem: UPSC preparation is vast, unstructured, and highly subjective. While Prelims (MCQs) are easy to evaluate, Mains (subjective essays) require expert feedback which is expensive and slow. Students lack personalized, immediate, and syllabus-aligned feedback based on the latest current affairs and standard materials (NCERTs, The Hindu, etc.).

Core Features:

Dynamic Mock Generation: AI creates customized mock tests based on specific subjects, difficulty levels, and current affairs.

Subjective Answer Evaluation: AI evaluates handwritten (via OCR) or typed answers against standard rubrics, highlighting missing keywords, structural flaws, and historical context.

Material Ingestion (RAG): Users or admins can upload PDFs (monthly magazines, budget documents), which the AI uses as ground truth to generate questions and evaluate answers.

Performance Analytics: Tracking student weak points across the vast UPSC syllabus.

2. High Level Architecture (HLD)
At a high level, we are building an event-driven microservices architecture. This ensures that heavy operations (like AI evaluation) don't block the core user experience.

Shutterstock

Components & Communication:

Client: Web application (React).

CDN/WAF: Cloudflare or AWS CloudFront for static asset delivery and DDoS protection.

API Gateway: The single entry point for the frontend, handling routing, SSL termination, and rate limiting.

Microservices: Independent services handling specific business domains.

Message Broker: Kafka or RabbitMQ for asynchronous communication between services.

Databases: A mix of Relational, NoSQL, and Vector databases (Polyglot persistence).

AI/RAG Pipeline Flow: 1. Document uploaded → 2. Text Extracted → 3. Chunked → 4. Embedded → 5. Stored in Vector DB.
During an exam, the query is embedded, similar context is retrieved from the Vector DB, and passed to the LLM to ground its response.

3. Backend Architecture
We will use a hybrid microservices approach, leveraging your preferred stack: Spring Boot (Java) for robust, transactional core services, and Express (Node.js/JavaScript) for IO-heavy API integrations and AI orchestration.

Service Breakdown:

API Gateway: Can be implemented using Spring Cloud Gateway or an infrastructure tool like Kong/AWS API Gateway.

Auth Service (Spring Boot): Manages JWT issuance, user sessions, and RBAC (Role-Based Access Control - Admin vs. Student).

Exam & Content Service (Spring Boot): Core CRUD operations for exams, syllabus management, and user exam history. Needs high consistency.

AI Orchestration & Evaluation Service (Node.js/Express): JavaScript is excellent for handling the heavy asynchronous I/O required when talking to external LLM APIs (OpenAI/Anthropic) and Vector DBs.

Ingestion Service (Node.js/Express or Python): Background workers that process uploaded PDFs, run OCR, and chunk text.

Implementing Key SDE2 Concepts:

Caching: Use Redis for frequently accessed data (e.g., standard UPSC syllabus details, previous years' question metadata).

Idempotency: When a user submits an exam, network hiccups might cause them to click "Submit" twice. The frontend must send an Idempotency-Key (a UUID) in the header. The backend checks a fast store (Redis) to ensure it only processes that specific submission once.

Rate Limiting: Implemented at the API Gateway using a Token Bucket algorithm (e.g., 100 requests/minute per user ID) to prevent abuse of expensive LLM endpoints.

Async Processing & Message Queues: When an exam is submitted, the Exam Service saves it and publishes an ExamSubmittedEvent to a Kafka topic. The AI Evaluation Service consumes this, processes the AI grading, and pushes an EvaluationCompletedEvent.

Fault Tolerance & Retries: AI APIs fail frequently. Implement the Circuit Breaker pattern (using Resilience4j in Java). If the OpenAI API fails, retry with exponential backoff and jitter. If it fails consecutively, open the circuit and fallback to a "Queued for later" message.

4. AI System Design (RAG Pipeline)
This is the brain of your application. You are relying on RAG to ensure the LLM doesn't hallucinate facts, which is fatal for UPSC prep.

Data Ingestion Pipeline:

Parsing: Extract text from PDFs using tools like AWS Textract or PyMuPDF.

Document Chunking: Break documents into semantically meaningful chunks (e.g., 500-1000 tokens) with overlap so context isn't lost at the edges. LangChain or LlamaIndex handles this well.

Embeddings Generation: Pass chunks through an embedding model (e.g., text-embedding-3-small) to convert text into high-dimensional vectors.

Vector Database: Store these vectors in Pinecone, Weaviate, or PostgreSQL with the pgvector extension.

Retrieval & Generation Pipeline:

Prompt Construction: When a user needs an evaluation, your system builds a prompt: "You are an expert UPSC examiner. Evaluate the user's answer against the following source context: {Context from Vector DB}. User Answer: {Answer}".

Answer Evaluation System: Ask the LLM to output a strict JSON structure containing: score (out of 10), missing_keywords, structural_feedback, and historical_inaccuracies.

5. Database Design
A production system requires the right database for the right job.

Relational DB (PostgreSQL): Used for strict, transactional data.

Tables: Users, Subscriptions, Transactions, Exam_Metadata.

Indexing: B-Tree indexes on user_id, exam_date for fast lookups.

Document DB (MongoDB): Used for data with flexible schemas, like the actual exam content and detailed evaluation logs.

Collections: Exam_Submissions (stores the raw text arrays of answers), Evaluation_Results (stores the nested JSON output from the LLM).

Vector DB (Pinecone / pgvector): * Stores the embeddings of the study materials. Indexed using HNSW (Hierarchical Navigable Small World) for fast nearest-neighbor search.

Caching Strategy: Cache the user profile and their dashboard summary in Redis using a Write-Through or Cache-Aside pattern. Invalidate the cache whenever a new exam evaluation completes.

6. Frontend Architecture
Stack: React, TypeScript, Redux Toolkit, React Router.

Component Architecture: Use an Atomic Design approach. Separating smart (container) components that interact with Redux from dumb (presentational) components ensures reusability.

State Management: Redux Toolkit for global state (user session, current exam state). RTK Query is highly recommended here for data fetching, as it gives you caching and loading states out of the box.

Performance Optimization & Code Splitting: A mock exam interface is heavy. Use React.lazy() and Suspense to load the "Exam Engine" code only when the user actually starts an exam.

Virtualization: If a user is reviewing hundreds of past questions, use react-window to render only the items visible in the DOM.

Error Handling: Implement React Error Boundaries to prevent a crash in a single component (like an AI feedback widget) from taking down the entire UI.

7. System Design Concepts for Scale
Horizontal Scaling: Your microservices should be stateless. Store session data in Redis, not in application memory. This allows you to spin up 10 instances of your Evaluation Service during peak exam season.

Load Balancing: An Application Load Balancer (ALB) routes incoming traffic across your healthy service instances.

Consistent Hashing: If you scale your Redis cache layer, use consistent hashing to distribute the cached data across multiple Redis nodes without massive cache misses during scaling events.

Observability: You cannot fix what you cannot see.

Logs: Centralize logs using the ELK stack (Elasticsearch, Logstash, Kibana) or Datadog.

Metrics: Expose Prometheus metrics from Spring Boot (Micrometer) to monitor JVM memory, API latency, and error rates.

Tracing: Implement OpenTelemetry. Pass a trace-id in the headers from the API Gateway all the way through your microservices so you can track the exact path of a slow request.

8. LLD (Low Level Design) & Design Patterns
Applying Gang of Four patterns elevates your code from a script to an enterprise application.

Factory Pattern: Use this in the QuestionGenerationService. A QuestionFactory can dynamically create MCQQuestion, EssayQuestion, or CaseStudyQuestion objects based on the requested exam type.

Strategy Pattern: Perfect for the evaluation logic. You might have an EvaluationStrategy interface with concrete implementations: StrictUPSCStrategy, LenientBeginnerStrategy, and KeywordOnlyStrategy. You can swap these at runtime based on the user's settings.

Observer Pattern: Used in your event-driven architecture. When an Exam is saved, EmailNotificationObserver and AnalyticsObserver listen for the state change to perform their tasks.

Adapter Pattern: Do not tightly couple your code to OpenAI's specific SDK. Create an LLMAdapter interface. Write an OpenAIAdapter and an AnthropicAdapter. If OpenAI goes down, you just switch the adapter.

Repository Pattern: Abstracts the database logic. Your services talk to a UserRepository interface, not directly to PostgreSQL or MongoDB, making unit testing much easier.

9. Async Processing
Never make the user wait for a synchronous API call if the task takes more than 500ms.

Where to use it: 1. AI Answer Evaluation (takes 5-15 seconds per essay).
2. RAG Document Ingestion (processing a 100-page PDF takes minutes).
3. Generating a 100-question Mock Test.

Implementation: The Frontend sends a request → Backend validates, saves "Pending" status in DB, publishes a message to Kafka/RabbitMQ → Backend returns HTTP 202 Accepted with a job_id → Frontend polls the /status/{job_id} endpoint (or uses Server-Sent Events/WebSockets) to notify the user when the task is complete.

10. Monetization Model (SaaS)
Freemium: Free daily current affairs quiz (drives daily active users).

Pay-per-Exam (Credits): Users buy credits to get their subjective essays evaluated (since LLM calls cost you money per token).

Pro Subscription (ARR): $X/month for unlimited objective mock tests, personalized AI mentorship, and RAG access to premium curated study materials.

11. Deployment Architecture
Containerization: Every service, including the frontend, is packaged into a Docker container.

Orchestration: Deploy to Kubernetes (AWS EKS or GCP GKE). This handles auto-healing (restarting crashed pods) and auto-scaling (adding more pods if CPU usage spikes).

CI/CD Pipeline: GitHub Actions.

PR merged → Run unit tests → Build Docker image → Push to Elastic Container Registry (ECR) → Apply Kubernetes manifests to staging environment.

12. Learning Roadmap (MVP to Production)
Phase 1: The Monolith MVP (Focus: Core Logic & AI)

Build a single Express/Node.js or Spring Boot monolith.

Implement standard JWT Auth.

Integrate OpenAI API for simple prompt-based evaluation (no RAG yet).

Build the React frontend. Connect it to a PostgreSQL database.

Phase 2: RAG & Asynchronous Flow (Focus: SDE1 → SDE2 transition)

Extract the AI logic into a separate service.

Set up Pinecone/pgvector. Build the PDF parsing and chunking pipeline.

Implement RabbitMQ/Kafka for async evaluation processing.

Introduce Redis caching for read-heavy operations.

Phase 3: Microservices & Scale (Focus: Architecture)

Split the monolith into the microservices defined in the HLD.

Implement API Gateway, Rate Limiting, and Circuit Breakers.

Containerize everything with Docker and write Kubernetes deployments.

Phase 4: Production Readiness (Focus: Staff Engineer concerns)

Implement comprehensive CI/CD.

Set up Datadog/ELK for centralized logging and tracing.

Run load tests using JMeter or Artillery to find and fix database bottlenecks and scale the system to thousands of concurrent users.

What would you like to tackle first? We can dive deeper into the database schema for the RAG pipeline, or map out the specific REST endpoints for the Exam service.