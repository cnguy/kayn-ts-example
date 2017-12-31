/// <reference path="../../node_modules/@types/express/index.d.ts" />
import * as express from 'express';
import * as lolapi from 'kayn'
const { Kayn, REGIONS } = lolapi

const kayn = Kayn()()

import { MatchV3MatchReferenceDto } from 'kayn/typings/dtos';

const NotFoundRes = (res: any) => res.status(404).send({ code: 404, message: 'Not Found' })

export default express.Router()
  .get('/', (req, res) => {
    res.status(200).send({ hello: 'world' });
  })
  /* localhost:8080/api/summoners/:name/matchlist/game-ids-of-past-five-games */
  .get('/api/summoners/:name', async (req, res) => {
    try {
      const summoner = await kayn.Summoner.by.name(req.params.name).region(REGIONS.NORTH_AMERICA)
      res.json(summoner)
    } catch (ex) {
      NotFoundRes(res)
    }
  })
  /* localhost:8080/api/summoners/:name/matchlist/game-ids-of-past-five-games */
  .get('/api/summoners/:name/matchlist/game-ids-of-past-five-games', async (req, res) => {
    try {
      const summoner = await kayn.Summoner.by.name(req.params.name)
      const accountID = summoner.accountId as number
      const matchlist = await kayn.Matchlist.by.accountID(accountID).query({
        beginIndex: 0,
        endIndex: 5,
      })
      const matches = matchlist.matches as MatchV3MatchReferenceDto[]
      const gameIDs = matches.map(match => match.gameId)
      res.json(gameIDs)
    } catch (ex) {
      NotFoundRes(res)
    }
  })

    