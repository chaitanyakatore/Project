# ReSureAI - AI Powered Reinsurance Underwriting Platform

## Overview

ReSureAI is a cloud-native underwriting platform built for reinsurance companies to automate risk assessment workflows.

The platform allows brokers to upload policy documents, automatically processes them using AI, calculates risk score + premium, and enables underwriters to approve/reject policies.

This project is designed to simulate production-grade architecture using:

- React
- Node.js
- Express
- Java Spring Boot
- AWS S3
- AWS SQS
- AWS Lambda
- DLQ
- PostgreSQL
- Redis
- Docker
- Kubernetes
- AI APIs
- Microservices architecture

---

# Problem Statement

Traditional underwriting systems have several issues:

- Manual document review
- Slow premium generation
- Human errors in risk evaluation
- No automation for document extraction
- Poor fault tolerance
- Difficult scalability

This platform solves these issues using event-driven architecture.

---

# Product Goals

- Automate underwriting workflow
- Reduce manual risk evaluation
- Introduce AI-powered document understanding
- Build fault tolerant architecture
- Implement production-ready microservices
- Learn enterprise architecture patterns

---

# User Roles

## Broker

- Creates submissions
- Uploads documents
- Tracks policy approval status

## Underwriter

- Reviews risk reports
- Approves/rejects submissions
- Requests additional documents

## Admin

- Monitors platform health
- Handles failed jobs
- Manages users

---

# System Architecture

```plaintext
Frontend (React)
      |
API Gateway
      |
------------------------------------------------------------
|            |            |            |                   |
Auth       Submission   Document     Pricing          Notification
Service    Service      Service      Service           Service
(Java)     (Node.js)    (Node.js)    (Java)            (Node.js)
      |
------------------------------------------------------------
      |
AWS Services
------------
S3 -> Lambda -> SQS -> AI Service -> DB
                 |
                DLQ
```
