const fs = require('fs');

const outputFolder = process.argv.slice(2);

const memberModule = require(`../../${outputFolder}/src/model/db/member-table`);
const memberModuleInstance = memberModule.MemberTable.getInstance();
const sqlMemberModule = memberModuleInstance.getSQLCreation();


const employerModule = require(`../../${outputFolder}/src/model/db/employer-table`);
const employerModuleInstance = employerModule.EmployerTable.getInstance();
const sqlEmployerModule = employerModuleInstance.getSQLCreation();

const dependentModule = require(`../../${outputFolder}/src/model/db/dependent-table`);
const dependentModuleInstance = dependentModule.DependentTable.getInstance();
const sqlDependentModule = dependentModuleInstance.getSQLCreation();

const contributionModule = require(`../../${outputFolder}/src/model/db/contribution-table`);
const contributionModuleInstance = contributionModule.ContributionTable.getInstance();
const sqlContributionModule = contributionModuleInstance.getSQLCreation();


const fileSQL = `
--- EMPLOYER SQL ---
${sqlEmployerModule}

--- DEPENDENT SQL ---
${sqlDependentModule}

--- MEMBER SQL ---
${sqlMemberModule}

--- CONTRIBUTION SQL ---
${sqlContributionModule}
`;

const outputPath = `${outputFolder}/db.sql`;
fs.writeFileSync(outputPath, fileSQL);

