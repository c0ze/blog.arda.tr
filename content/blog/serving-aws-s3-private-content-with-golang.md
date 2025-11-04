---
title: "Serving AWS S3 private content with Golang and AWS SDK for Go v2"
date: "2024-02-05"
excerpt: "Have you ever wanted to serve private files from your AWS S3 storage to your users, but making the bucket public is not a safe option? Learn how to do it with presigned URLs."
tags: ["go", "aws", "s3"]
---

Have you ever wanted to serve private files from your AWS S3 storage to your users, but making the bucket public is not a safe option? In this post, I will show you how to do it using Golang and AWS SDK for Go v2 with a presigned URL, and later, you can integrate it with your own authentication system.

## Prerequisites

- Go 1.19 or later
- AWS SDK for Go v2
- Private S3 bucket and credentials to access it (at least s3:GetObject permission)

## Implementation

We'll use presigned URLs to provide temporary access to private S3 objects. This approach ensures security while maintaining flexibility in how you serve files to your users.

### Creating the AWS S3 client

There are two options for creating the AWS S3 client - using access keys (not recommended for production) or using IAM role for service account credentials (recommended).

### Using presigned URLs

Presigned URLs are a secure way to grant temporary access to private S3 objects without making your bucket public. The URL contains authentication information in the query string parameters.

This method is perfect for serving private content while maintaining security and control over your S3 resources.
