// Ce fichier connecte notre backend à Cloudinary (service d'images)
import {v2 as cloudinary} from 'cloudinary';
import { config } from './config.ts';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export default cloudinary;