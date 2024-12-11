const path = require("path");
const fs = require("fs");
const TJS = require("typescript-json-schema");

function buildSchema(sourceFilePath, modelName, targetFilePath, schemaName) {
    const filesPath = [
        path.resolve(`${sourceFilePath}`)
    ];

    const program = TJS.getProgramFromFiles(filesPath);

    const settings = {
        required: true,
        noExtraProps: true,
    };

    const schema = TJS.generateSchema(program, `${modelName}`, settings);

    const schemaString = JSON.stringify(schema, null, 2);
    const replaceAnyOf = schemaString.replaceAll('anyOf', 'oneOf');
    const fileSchema = `export const ${schemaName} = \`${replaceAnyOf}\`;`;

    const outPathSchema = `${targetFilePath}`;

    fs.writeFileSync(outPathSchema, fileSchema);
};


const outputBasePath = `${__dirname}/../schemas/generated-schemas`;

const sourcePathFileMember = `${__dirname}/../src/model/api/member-api.ts`;
const modelNameMember = 'Member';
const outputPathMember = `${outputBasePath}/member-schema.ts`;
const schemaNameMember = 'memberSchemaJson';
buildSchema(sourcePathFileMember, modelNameMember, outputPathMember, schemaNameMember);