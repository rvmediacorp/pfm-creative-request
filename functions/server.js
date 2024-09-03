const { Client } = require("@notionhq/client");
require("dotenv").config();
const querystring = require("querystring");

// Initialize Notion client with your integration token
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
console.log("Working");
const producerIds = {
  Oleg: "95812763-0ef8-4772-83c0-0f6e21f6400e",
  Timofey: "56cc1913-a9d6-41f0-b70b-baf2a00c680f",
  "Rus F": "3793d6c9-1e59-4986-91b7-a5ddbbb68a86",
  "Dima V": "65ec1d09-9170-4f79-a5cd-9b955e411b61",
  "Nathan R": "caad7c15-c556-4df6-90e1-0a0c4a30b497",
  "Andrey T": "d9412558-18a4-407f-9e4b-d6900ec9c74f",
  // The bot user is not a person, so we don't include it here.
};

// Netlify function handler
exports.handler = async (event, context) => {
  console.log(event.body.project_name);
  // const t = JSON.parse(event.body);
  // console.log(t);
  try {
    const body = querystring.parse(event.body);
    const {
      iteration_new_concept,
      category,
      project_name,
      reference_link,
      loom_video,
      instructions,
      type,
      format,
      primary_text,
      headline_on_platform,
      description,
      visual_hook,
      v_hooks,
      audible_hook,
      a_hooks,
      visual_headline,
      v_headlines,
      core_concept_script,
      cc_scripts,
      ctas,
      number_of_ctas,
      captions,
      producer,
      testing_media_buyers,
    } = body;

    // Ensure testing_media_buyers is an array
    let buyersArray = Array.isArray(testing_media_buyers)
      ? testing_media_buyers
      : [testing_media_buyers];
    let formatArray = Array.isArray(format) ? format : [format];

    // Map the selected producer name to their corresponding Notion ID
    const producer_id = producerIds[producer];

    // Create a new page in the Notion database
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Iteration/New Concept": { select: { name: iteration_new_concept } },
        Category: { select: { name: category } },
        "Project Name(mo.day-category,name,type)": {
          title: [{ text: { content: project_name } }],
        },
        Reference: { url: reference_link },
        "Loom Video": { url: loom_video },
        Instructions: { rich_text: [{ text: { content: instructions } }] },
        Type: { select: { name: type } },
        Format: { multi_select: formatArray.map((item) => ({ name: item })) },
        "Primary Text": { rich_text: [{ text: { content: primary_text } }] },
        "Headline (on platform)": {
          rich_text: [{ text: { content: headline_on_platform } }],
        },
        Description: { rich_text: [{ text: { content: description } }] },
        "Visual Hook": { rich_text: [{ text: { content: visual_hook } }] },
        "V Hooks": { number: parseInt(v_hooks) },
        "Audible Hook": { rich_text: [{ text: { content: audible_hook } }] },
        "A Hooks": { number: parseInt(a_hooks) },
        ...(visual_headline && {
          "Visual Headline": {
            rich_text: [{ text: { content: visual_headline } }],
          },
        }),
        "V Headlines": { number: parseInt(v_headlines) || 0 },
        ...(cc_scripts !== undefined &&
          cc_scripts !== null &&
          cc_scripts !== "" &&
          !isNaN(cc_scripts) && {
            "CC/Scripts": { number: parseInt(cc_scripts) },
          }),
        // New code for "CTA's" and "CTA #"
        ...(ctas && {
          "CTA's": { rich_text: [{ text: { content: ctas } }] },
        }),
        ...(number_of_ctas !== undefined &&
          number_of_ctas !== null &&
          number_of_ctas !== "" &&
          !isNaN(number_of_ctas) && {
            "CTA #": { number: parseInt(number_of_ctas) },
          }),
        "Captions?": { select: { name: captions } },
        Producer: { people: [{ id: producer_id }] },
        "Testing Media Buyers": {
          multi_select: buyersArray.map((buyer) => ({ name: buyer })),
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Form data successfully submitted to Notion!",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There was an error submitting the form.",
        error: error.message,
      }),
    };
  }
};
