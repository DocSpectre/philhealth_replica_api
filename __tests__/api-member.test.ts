import { BASE_PATH } from "../config/constants";

import request from 'supertest';
import app from '../app';

describe('Member Endpoints', () => {
    it('should create a new member', async () => {
        const res = await request(app)
            .post(`${BASE_PATH}/members`)
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '1234567890',
                address: '123 Lucena, Quezon, PH',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John Doe');
    });

    it('should get all members', async () => {
        const res = await request(app).get(`${BASE_PATH}/members`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a member by ID', async () => {
        const res = await request(app).get(`${BASE_PATH}/members/1`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    it('should update a member by ID', async () => {
        const res = await request(app)
            .put(`${BASE_PATH}/members/1`)
            .send({
                name: 'John Updated',
                email: 'john.updated@example.com',
                phone: '9876543210',
                address: '123 Lucena, Quezon, PH',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'John Updated');
    });

    it('should delete a member by ID', async () => {
        const res = await request(app).delete('/members/1');
        expect(res.statusCode).toEqual(204);
    });
});
