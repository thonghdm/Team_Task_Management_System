// const mongoose = require('mongoose');
// const { faker } = require('@faker-js/faker');
// const { Project } = require('./src/models/ProjectSchema');
// const List = require('./src/models/ListSchema');
// const Task = require('./src/models/TaskSchema');

// // Connect to MongoDB
// mongoose.connect('mongodb://0.0.0.0:27017/react-login-tut', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Fixed IDs for owner and members
// const fixedIds = [
//     '67166f8e623c5dac8ab9ed3c',
//     '67166f9a623c5dac8ab9ed46',
//     '67166fa3623c5dac8ab9ed50',
// ];

// // Hàm tạo dữ liệu giả cho Project
// const createFakeProjects = async (numProjects) => {
//     const projects = [];
    
//     // Create Projects
//     for (let i = 0; i < numProjects; i++) {
//         const project = new Project({
//             projectName: faker.company.name(),
//             slug: faker.lorem.slug(),
//             description: faker.lorem.sentences(2),
//             ownerId: fixedIds[0], // Set a fixed owner ID (you can choose any ID from the list)
//             membersId: [
//                 fixedIds[Math.floor(Math.random() * fixedIds.length)], // Randomly select a member ID
//                 fixedIds[Math.floor(Math.random() * fixedIds.length)], // Randomly select another member ID
//             ],
//             listId: [], // This will be populated later
//             visibility: faker.helpers.arrayElement(['Public', 'Member']),
//             favorite: faker.datatype.boolean(),
//             isActive: faker.datatype.boolean(),
//         });
//         projects.push(project);
//     }

//     // Insert projects into the database
//     const createdProjects = await Project.insertMany(projects);

//     // Create Lists and associate them with the Projects
//     for (const project of createdProjects) {
//         const lists = [];
//         for (let j = 0; j < 3; j++) { // Create 3 lists per project
//             const list = new List({
//                 list_name: faker.commerce.department(),
//                 project_id: project._id, // Associate this list with the current project
//                 task_id: [faker.string.uuid(), faker.string.uuid()],
//                 is_active: faker.datatype.boolean(),
//             });
//             lists.push(list);
//         }
        
//         const createdLists = await List.insertMany(lists);

//         // Update the project with the list IDs
//         const listIds = createdLists.map(list => list._id);
//         await Project.findByIdAndUpdate(project._id, { listId: listIds });
//     }

//     console.log(`${numProjects} projects created!`);
// };

// // Hàm tạo dữ liệu giả cho Task
// const createFakeTasks = async (numTasks) => {
//     const tasks = [];
    
//     // Create Tasks
//     for (let i = 0; i < numTasks; i++) {
//         const task = new Task({
//             project_id: faker.string.uuid(), // Ideally, replace with actual project ID
//             list_id: faker.string.uuid(), // Ideally, replace with actual list ID
//             task_name: faker.hacker.verb(),
//             description: faker.lorem.sentences(3),
//             img: faker.image.url(),
//             checklist: faker.datatype.boolean(),
//             status: faker.helpers.arrayElement(['To Do', 'In Progress', 'Completed']),
//             priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
//             assigned_to_id: [fixedIds[Math.floor(Math.random() * fixedIds.length)]], // Randomly assign a user from fixed IDs
//             created_by_id: fixedIds[0], // Use fixed owner ID
//             start_date: faker.date.past(),
//             end_date: faker.date.future(),
//             is_active: faker.datatype.boolean(),
//             comment_id: [faker.string.uuid()],
//             attachments_id: [faker.string.uuid()],
//             label_id: [faker.string.uuid()],
//         });
//         tasks.push(task);
//     }
//     await Task.insertMany(tasks);
//     console.log(`${numTasks} tasks created!`);
// };

// // Hàm gọi để tạo tất cả dữ liệu
// const createMockData = async () => {
//     await createFakeProjects(6); // Create 6 projects
//     await createFakeTasks(10);   // Create 20 tasks

//     mongoose.connection.close();  // Close the connection after completion
// };

// // Start the data creation process
// createMockData();
