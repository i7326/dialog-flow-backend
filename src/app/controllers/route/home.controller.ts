import { JsonController, Get } from 'routing-controllers';

@JsonController('/')
export class HomeController {
  @Get()
  public find(): any {
    return {
      message: 'test',
    };
  }
}
