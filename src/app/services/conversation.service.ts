import { Service } from 'typedi';
import * as apiai from 'apiai';
import * as request from 'request';
import * as cheerio from 'cheerio';

@Service()
export class ConversationService {
  private client: any;
  constructor() {
    this.client = apiai('47d91671250d44c2bfca074c80403d39');
  }

  public textRequest(text: string, session: any): Promise {
    return new Promise((resolve, reject) => {
      const chatrequest = this.client.textRequest(text, {
        sessionId: session,
      });

      chatrequest.on('response', (response) => {
        if (response.result.action) {
          this.handleAction(response.result).then((output) => { resolve(output); }).catch((error) => { reject(error); });
        } else { resolve(response); }
      });

      chatrequest.on('error', (error) => {
        reject(error);
      });

      chatrequest.end();

    });
  }

  private handleAction(result: any): Promise {
    if (result.action === 'input.search.course') return this.searchCourse(result.parameters);
    // return new Promise((resolve, reject) => {
    //   if (result.action === 'input.search.course') {
    //     resolve(this.searchCourse(result.parameters));
    //   } else {
    //     reject('Sorry I dint get that!!');
    //   }
    // });
  }



  private searchCourse(filter: any): any {
  const url = 'https://www.upes.ac.in/college-wise';
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error) {
        const $ = cheerio.load(html);
        let school = $('#ctl00_ContentPlaceHolder1_Accordion1 span').map((i, el) => {
          return $(el).text($(el).text().replace('School of', '').slice(0, -6));
        });
        if(filter.school.length > 0) {
          let schoolRegex = new RegExp(filter.school.join("|"), 'i');
          school = $('#ctl00_ContentPlaceHolder1_Accordion1 span').filter((i,el) => {
            return $(el).text().match(schoolRegex);
          });
        } else {
          school = $('#ctl00_ContentPlaceHolder1_Accordion1 span');
          resolve($(school).text());
        }
        let data = [];
        school.each((i, el) => {
          let courseElement;
          if(filter.programme_level && filter.programme_type){
            courseElement = $(el).parent().parent().next().find('.table-listing').filter((i,elm) => {
              return $(elm).find('h2').text().match(new RegExp(`${filter.programme_level}.*${filter.programme_type}|${filter.programme_type}.*${filter.programme_level}`));
            });
          } else if (filter.programme_level){
            courseElement = $(el).parent().parent().next().find('.table-listing').filter((i,elm) => {
              return $(elm).find('h2').text().match(filter.programme_level);
            });
          } else if (filter.programme_type){
            courseElement = $(el).parent().parent().next().find('.table-listing').filter((i,elm) => {
              return $(elm).find('h2').text().match(filter.programme_type);
            });
          } else {
            courseElement = $(el).parent().parent().next().find('.table-listing');
          }
          let course = [];
          courseElement.each((i, el1) => {
            let courses =[];
            $(el1).find('a').each((i, elm) => {
              courses.push({name: $(elm).text().trim(), url: $(elm).attr('href')});
            });

            console.log($(el1).find('h2').text().trim());
            course.push({"level": $(el1).find('h2').text().trim(), "courses": courses})
          })
          data.push({"school": $(el).text(),"course": course});
        })
        resolve(data);
      }
      reject(error);
    });
  });
    }
}
