#Introduction
This is demo PhotoBook app. PhotoBook allows user with mobile apps can post photo to web server.
PhotoBook has two parts:

1. Server part written in Node.js, Express. Server exposes REST web service.
  *. GET http://host/api/photo/ to get list of all photos
  *. POST {title: text, photo: file} http://host/api/photo/ to post a photo with title description
  *. GET http://host/api/photo/id to get a specific photo with id
  *. PUT {title: text, photo: file} http://host/api/photo/id to replace existing photo with new photo, new title

2. Client part. For demo purpose, I wrote in Swift. You can port to whatever technology you wwant for example: Android, Windows Phone.

#To set up
Server part require Postgresql to power. You need to install Postgresql server then create database named 'photobook'
create a simple table using this code
`CREATE TABLE photo
(
  id serial PRIMARY KEY, -- Primary key
  title character varying(255) NOT NULL,
  oldfile character varying(255) NOT NULL
);`
https://github.com/TechMaster/photobook/blob/master/Server/photobook/SQL/tables.sql

