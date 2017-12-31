/// <reference path="../../node_modules/@types/express/index.d.ts" />
import * as express from 'express'
import * as lolapi from 'kayn'
const { Kayn, REGIONS } = lolapi

// Type-safe config instead of just passing in a regular object.
const kaynConfig: KaynConfig = {
  region: REGIONS.NORTH_AMERICA,
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 3000,
  },
  // hello: 'world', // fails
}

const kayn = Kayn()()

import { MatchV3MatchReferenceDto, SummonerV3SummonerDTO } from 'kayn/typings/dtos'
import { KaynConfig } from 'kayn';

const NotFoundRes = (res: any) => res.status(404).send({ code: 404, message: 'Not Found' })

export default express.Router()
  .get('/', (req, res) => {
    res.status(200).send({ hello: 'world' });
  })
  /* localhost:8080/api/summoners/:name */
  .get('/api/summoners/:name', async (req, res) => {
    try {
      const summoner = await kayn.Summoner.by.name(req.params.name).region(REGIONS.NORTH_AMERICA) // Type inference.
      res.json(summoner)
    } catch (ex) {
      NotFoundRes(res)
    }
  })
  /* localhost:8080/api/summoners/:name/matchlist/game-ids-of-past-five-games */
  .get('/api/summoners/:name/matchlist/game-ids-of-past-five-games', async (req, res) => {
    try {
      const summoner: SummonerV3SummonerDTO = await kayn.Summoner.by.name(req.params.name) // Explicit type. Auto-imported by VSCode.
      const accountID: number = summoner.accountId! // Not-nullable assertion.
      const matchlist = await kayn.Matchlist.by.accountID(accountID).query({ // Type inference.
        beginIndex: 0,
        endIndex: 5,
      })
      const matches = matchlist.matches as MatchV3MatchReferenceDto[] // Type-casting.
      const gameIDs: Array<number> = matches.map(match => match.gameId!) // Not-nullable assertion.
      res.json(gameIDs)
    } catch (ex) {
      NotFoundRes(res)
    }
  })

    