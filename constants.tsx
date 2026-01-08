
import { WebPageType, WebPageScenario } from './types';

export const SCENARIOS: WebPageScenario[] = [
  {
    url: 'https://news-archive-1998.net/tech/headlines',
    type: WebPageType.NEWS,
    title: 'The Daily News - Classic Edition',
    originalTech: ['Tables (nested)', 'Marquee tags', 'CGI-Scripts'],
    originalContent: `
      <table border="1" width="100%" bgcolor="#cccccc">
        <tr>
          <td colspan="2" align="center"><h1>DAILY NEWS WORLDWIDE</h1></td>
        </tr>
        <tr>
          <td width="20%" valign="top">
            <b>Navigation</b><br>
            <a href="#">Home</a><br>
            <a href="#">Sports</a><br>
            <a href="#">Weather</a><br>
            <img src="https://picsum.photos/100/100" />
            <marquee>Breaking News: Web Browsers getting smarter?</marquee>
          </td>
          <td width="80%">
            <h2>AI is the future?</h2>
            <p>Scientists say computer brains might one day help us read websites more efficiently. This page is built with the latest HTML 3.2 standards.</p>
            <p>Advertisment: Buy a modem today! Only $299!</p>
            <div style="border: 2px solid red; padding: 10px;">
              CLICK HERE FOR WINNING PRIZES!!! (Popup blocked)
            </div>
            <hr>
            <h3>Comments</h3>
            <p>User123: First! Wow, cool site.</p>
          </td>
        </tr>
      </table>
    `
  },
  {
    url: 'https://mega-shop-clutter.biz/products/widget-45',
    type: WebPageType.ECOMMERCE,
    title: 'Mega Shop - Buy Everything Now!',
    originalTech: ['jQuery 1.4', 'Inline Styles', 'Multiple Trackers'],
    originalContent: `
      <div style="font-family: Arial; color: #333;">
        <div style="background: yellow; padding: 5px; text-align: center; font-weight: bold;">
          !!! SALE ENDS IN 00:05:21 !!!
        </div>
        <div style="float: left; width: 40%;">
          <img src="https://picsum.photos/400/400" />
          <p>Hover to zoom (broken)</p>
        </div>
        <div style="float: right; width: 55%;">
          <h1>Ultimate Productivity Widget v2.0</h1>
          <h2 style="color: red;">$49.99 <span style="text-decoration: line-through; color: gray;">$999.99</span></h2>
          <p>This is the best widget you will ever buy in your entire life. It has many features including rotating, clicking, and being on your desk.</p>
          <button style="background: green; color: white; padding: 20px; width: 100%; font-size: 24px;">ADD TO CART</button>
          <div style="margin-top: 20px;">
            <h4>User Reviews</h4>
            <p><b>Bad Bot:</b> I love this product. It definitely isn't a scam.</p>
            <p><b>Real Person:</b> Took 3 weeks to arrive. Box was crushed.</p>
          </div>
        </div>
        <div style="clear: both; background: #eee; padding: 10px; font-size: 10px;">
          Tracking pixels: Facebook, Google, Bing, Random Ad Network #5, CryptoMiner Script...
        </div>
      </div>
    `
  },
  {
    url: 'https://retro-forum.org/threads/ai-and-web',
    type: WebPageType.FORUM,
    title: 'Old School Forum - Tech Discussions',
    originalTech: ['PHPBB 2.0', 'No Mobile View', 'Nested Divs'],
    originalContent: `
      <div id="forum-container" style="width: 800px; margin: 0 auto; border: 1px solid #000;">
        <div class="header" style="background: #004a99; color: white; padding: 10px;">
          FORUM INDEX > TECH > GENERAL
        </div>
        <div class="post" style="border-bottom: 5px solid #ccc; display: flex;">
          <div class="user-info" style="width: 150px; background: #f2f2f2; padding: 10px; font-size: 12px;">
            <b>RetroCoder</b><br>
            Posts: 1,422<br>
            Joined: 2004<br>
            <img src="https://picsum.photos/80/80" />
          </div>
          <div class="post-content" style="padding: 10px; flex: 1;">
            <div class="date" style="font-size: 10px; color: #666;">Posted: 12-Oct-2005 14:22</div>
            <p>Does anyone think browsers will ever be able to just... fix websites for us? Like if a site is ugly, the browser just makes it pretty?</p>
            <hr>
            <div class="sig" style="font-size: 10px; color: #999;">-- Coding like it's 1999 --</div>
          </div>
        </div>
        <div class="post" style="border-bottom: 5px solid #ccc; display: flex;">
          <div class="user-info" style="width: 150px; background: #f2f2f2; padding: 10px; font-size: 12px;">
            <b>OptimistPrime</b><br>
            Posts: 12<br>
            Joined: 2005<br>
            <img src="https://picsum.photos/81/81" />
          </div>
          <div class="post-content" style="padding: 10px; flex: 1;">
            <div class="date" style="font-size: 10px; color: #666;">Posted: 13-Oct-2005 09:10</div>
            <p>That sounds like science fiction! It would require some sort of artificial intelligence that understands layout.</p>
          </div>
        </div>
        <div class="ad-banner" style="text-align: center; padding: 20px;">
          <img src="https://picsum.photos/468/60" alt="Fake Ad" />
          <p style="font-size: 9px;">Support us by clicking this banner!</p>
        </div>
      </div>
    `
  },
  {
    url: 'https://techblog-archive.io/articles/2003',
    type: WebPageType.DOCS,
    title: 'TechBlog Archive - Web Standards',
    originalTech: ['Frames', 'Flash', 'ActiveX'],
    originalContent: `
      <frameset cols="200,*">
        <frame src="nav.html" name="navigation">
        <frame src="content.html" name="main">
      </frameset>
      <div style="font-family: Times New Roman; background: white; padding: 20px;">
        <h1 style="color: #003366;">The Future of Web Development</h1>
        <p style="text-align: justify; line-height: 1.4;">
          In this article, we explore cutting-edge technologies like XML, XSLT, and the revolutionary new language called JavaScript.
        </p>
        <embed src="flash-animation.swf" width="400" height="300"></embed>
        <p><blink>NEW!</blink> Download our ActiveX control for enhanced viewing experience!</p>
        <table border="1" cellpadding="10" style="background: #ffffcc;">
          <tr><td><b>Author:</b> John WebMaster</td></tr>
          <tr><td><b>Published:</b> January 2003</td></tr>
          <tr><td><b>Views:</b> <img src="counter.gif" alt="1234" /></td></tr>
        </table>
      </div>
    `
  },
  {
    url: 'https://classifieds-99.com/listings/electronics',
    type: WebPageType.ECOMMERCE,
    title: 'Online Classifieds - Electronics',
    originalTech: ['CGI', 'Perl Scripts', 'Image Maps'],
    originalContent: `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
        <tr>
          <td colspan="3" bgcolor="#FF0000" height="50">
            <font color="white" size="6"><b>CLASSIFIEDS ONLINE</b></font>
          </td>
        </tr>
        <tr>
          <td width="150" bgcolor="#EEEEEE" valign="top">
            <font size="2">
              <a href="#">Home</a><br>
              <a href="#">Buy</a><br>
              <a href="#">Sell</a><br>
              <a href="#">Contact</a><br>
              <img src="https://picsum.photos/120/200" usemap="#admap">
            </font>
          </td>
          <td width="10"></td>
          <td>
            <h2>ELECTRONICS FOR SALE</h2>
            <table border="1" width="100%">
              <tr bgcolor="#CCCCCC">
                <td><b>Item</b></td>
                <td><b>Price</b></td>
                <td><b>Seller</b></td>
              </tr>
              <tr>
                <td>Pentium II Computer 400MHz</td>
                <td><font color="green"><b>$450</b></font></td>
                <td>Mike_1999</td>
              </tr>
              <tr>
                <td>56k Modem - Brand New!</td>
                <td><font color="green"><b>$89</b></font></td>
                <td>TechDeals</td>
              </tr>
            </table>
            <p><font size="1" color="gray">Sponsored: Win a FREE iPod! Click here!</font></p>
          </td>
        </tr>
      </table>
    `
  }
];
