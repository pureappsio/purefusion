import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// General
Brands = new Mongo.Collection('brands');
Integrations = new Mongo.Collection('integrations');
Elements = new Mongo.Collection('elements');
Metas = new Mongo.Collection('metas');
Categories = new Mongo.Collection('categories');
Caches = new Mongo.Collection('caches');
Tags = new Mongo.Collection('tags');

// Posts
Posts = new Mongo.Collection('posts');
Menus = new Mongo.Collection('menus');
Networks = new Mongo.Collection('networks');
Boxes = new Mongo.Collection('boxes');
Pricing = new Mongo.Collection('pricing');

Recordings = new Mongo.Collection('recordings');
Visitors = new Mongo.Collection('visitors');

// Funnels
Pages = new Mongo.Collection('pages');
Funnels = new Mongo.Collection('funnels');

// Products
Products = new Mongo.Collection('products');
Variants = new Mongo.Collection('variants');
Reviews = new Mongo.Collection('reviews');

// Courses
Modules = new Mongo.Collection('modules');
Lessons = new Mongo.Collection('lessons');
Bonuses = new Mongo.Collection('bonuses');
Resources = new Mongo.Collection('resources');

// Sales
Sales = new Mongo.Collection('sales');
Discounts = new Mongo.Collection('discounts');
Gateways = new Mongo.Collection('gateways');

// Statistics
Events = new Mongo.Collection('events');
Statistics = new Mongo.Collection('statistics');
Graphs = new Mongo.Collection('graphs');
Entries = new Mongo.Collection("entries");
EntryCategories = new Mongo.Collection("entrycategories");

// CRM
Subscribers = new Mongo.Collection('subscribers');

// Email
Sequences = new Mongo.Collection('sequences');
Broadcasts = new Mongo.Collection("broadcasts");
Conditions = new Mongo.Collection("conditions");
Automations = new Mongo.Collection("automations");
Scheduled = new Mongo.Collection("scheduled");
ConditionalEmails = new Mongo.Collection("conditionalemails");
EmailTemplates = new Mongo.Collection("emailtemplates");
Offers = new Mongo.Collection('offers');

// Social
SocialPosts = new Mongo.Collection('socialposts');
Queues = new Mongo.Collection('queues');
Schedules = new Mongo.Collection('schedules');
Audiences = new Mongo.Collection('audiences');
Messages = new Mongo.Collection('messages');
MessengerQueues = new Mongo.Collection('messengerqueues');
Services = new Mongo.Collection('services');

// Ads
Campaigns = new Mongo.Collection('campaigns');