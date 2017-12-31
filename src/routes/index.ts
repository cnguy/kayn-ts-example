/// <reference path="../../node_modules/@types/express/index.d.ts" />
import * as express from 'express';
import * as lolapi from 'kayn'
const { Kayn, REGIONS } = lolapi

const kayn = Kayn()()

export default express.Router()
  .get('/', (req, res) => {
    res.status(200).send({ hello: 'test' });
  })
  .get('/api/summoners/:name', async (req, res) => {
    try {
      // const summoner = await kayn.Summoner.by.name(req.params.name)
      const summoner = await kayn.Summoner.by.name(req.params.name).region(REGIONS.NORTH_AMERICA)
      const name : string | undefined = summoner.name // This can be improved hmm..
      res.json(summoner)
    } catch (ex) {
      res.status(404).send({
        code: 404,
        message: 'Not Found',
      })
    }
  })

    