const options = {
  definition: {
    openapi: "3.0.0", // Specifies the OpenAPI Specification version being used
    info: {
      title: "Labass Platform API",
      version: "1.0.0", // Version of the API
      description: "API Documentation for Labass Platform",
    },
    // Include other necessary OAS fields as per your API's requirements
  },
  apis: ["src/api_labass/routes/*.ts"], // Path to source files
};
