
// describe('Employer Endpoints', () => {
//     it('should create a new employer', async () => {
//         const res = await request(app)
//             .post('/employers')
//             .send({
//                 name: 'ACS BCN',
//                 address: '123 Lucena, Quezon, PH',
//                 contact: 'test@acsbcn.com',
//             });
//         expect(res.statusCode).toEqual(201);
//         expect(res.body).toHaveProperty('id');
//     });

//     it('should get all employers', async () => {
//         const res = await request(app).get('/employers');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toBeInstanceOf(Array);
//     });

//     it('should get an employer by ID', async () => {
//         const res = await request(app).get('/employers/1');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('id', 1);
//     });

//     it('should update an employer by ID', async () => {
//         const res = await request(app)
//             .put('/employers/1')
//             .send({
//                 name: 'ACS BCN',
//                 address: '123 Lucena, Quezon, PH',
//                 contact: 'test@acsbcn.com',
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('address', '123 Lucena, Quezon, PH');
//     });

//     it('should delete an employer by ID', async () => {
//         const res = await request(app).delete('/employers/1');
//         expect(res.statusCode).toEqual(204);
//     });
// });
