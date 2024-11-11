import { MySongsController } from './my-songs.controller';

describe('MySongsController', () => {
  let controller: MySongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MySongsController],
    }).compile();

    controller = module.get<MySongsController>(MySongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
