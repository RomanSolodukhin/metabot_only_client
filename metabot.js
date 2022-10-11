var screennameRegex="[A-Za-z0-9_]+"
let currentPostBots = window.localStorage.getItem('currentPostBots') || null

/* отображение кол-ва ботов ==== начало */
class injectionManager { // вот это бы заменить на какие-то хуки сервис воркера
	constructor(callback, context = null) {
		this.context = context
		this.callback = callback
		this.timerId = null
		this.start()
	}
	start () {
		let interval = 500
		if (this.timerId) clearInterval(this.timerId)
		if (this.context) this.timerId = setInterval(this.callback.bind(this.context), interval)
		else this.timerId = setInterval(this.callback, interval)
	}
	stop () {
		clearInterval(this.timerId)
	}
}

const bots = {
	bots_posts: {
		'https://twitter.com/dw_russian/status/1575888200534327297': {
			bots: {
				'GaziirHabbas': [
					'https://twitter.com/GaziirHabbas/status/1575898174736121856',
					'https://twitter.com/GaziirHabbas/status/1575898174736121856',
					'https://twitter.com/GaziirHabbas/status/1575898174736121856'
				],
				'jhhIEGhZBSEoCQT': [
					'https://twitter.com/jhhIEGhZBSEoCQT/status/1576105834580279296'
				],
				'W46cK5VZVbsXwCZ': [
					'https://twitter.com/W46cK5VZVbsXwCZ/status/1576054093139054592'
				]
			}
		},
		'https://twitter.com/jhhIEGhZBSEoCQT/status/1576105834580279296': {
			bots: {'fskdkfkd': [], 'sdfsdf': [], 'fsdfkfkmfmf': [], 'fsdfkkfmfmfmg': []}
		},
		'https://twitter.com/SpindelBerg/status/1575889921998721024': {
			bots: {'fskdkfkd': [], 'sdfsdf': [], 'fsdfkfkmfmf': [], 'fsdfkkfmfmfmg': []}
		}
	},
	currentPostBots: null,
	lastLinkOpened: null,
	showBotsList (postUrl) {
		this.currentPostBots = postUrl
		window.localStorage.setItem('currentPostBots', this.currentPostBots)
		let modal = document.querySelector('[id="bots-list"]')
		if (!modal) {
			const iconStyles = 'width: 20px; height: 20px; fill: currentColor;'
			let rootElement = document.querySelector('[data-at-shortcutkeys]')
			rootElement.style.filter = 'blur(20px)'
			rootElement.setAttribute('aria-hidden', true)
			document.querySelector('html').style.overflow = 'hidden'

			modal = document.createElement('div')
			modal.setAttribute('id', 'bots-list')
			//modal.setAttribute('tab-index', '10')
			modal.style = `z-index: 10; display: flex; justify-content: center; align-items: center; position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; color: currentColor; font-color: currentColor; height: 100vh; width: 100vw; overflow-y: visible;`
			document.querySelector('body').style.backgroundColor === 'rgb(255, 255, 255)' ? modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)' : modal.style.backgroundColor = 'rgba(91, 112, 131, 0.4)'
			document.querySelector('[id="layers"]').appendChild(modal)

			let modalWindow = document.createElement('div')
			modalWindow.setAttribute('id', 'bots-list-window')
			modalWindow.style = `background-color: ${document.querySelector('body').style.backgroundColor}; display: flex; flex-direction: column; padding: 10px; height: auto; border-radius: 10px; max-height: 100vh; overflow-y: visible; width: max-content; max-width: 600px;`
				+'font: 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;'
			modalWindow.classList.add('r-yfoy6g')
			modal.appendChild(modalWindow)

			let styles = document.createElement('style')
			styles.innerText = `a:hover {
				color: currentColor;
				max-width: fit-content;
				transition: color 100ms ease-in;
			}
			button:hover {
				color: currentColor;
				background-color: rgba(255, 255, 255, 0.1) !important;
				max-width: fit-content;
				border-radius: 1em;
				transition: all 100ms ease-in;
			}
			a:not(:hover), button:not(:hover) {
				color: rgb(139, 152, 165);
				max-width: fit-content;
				text-decoration: none;
				transition: color 100ms ease-in;
			}
			.posts {
				display: flex;
				flex-direction: column;
				justify-content: center;
				overflow-y: scroll;
				overflow-x: overlay;
				width: 100%;
				padding-left: 1em;
				padding-right: 2em;
				padding-top: 1em;
				padding-bottom: 1em;
			}
			::-webkit-scrollbar {
				display: none;
			}
			div {
				-ms-overflow-style: none;  /* IE и Edge */
				scrollbar-width: none;  /* Firefox */
			}
			[collapsed] {
				-moz-transform: translate(-50px, 0px);
				-webkit-transform: translate(-50px, 0px);
				-o-transform: translate(-50px, 0px);
				-ms-transform: translate(-50px, 0px);
				transform: translate(-50px, 0px);
				transition: all 0.2s ease-out;
			}
			`
			modalWindow.appendChild(styles)

			let textColorClass = document.querySelector('body').style.backgroundColor === 'rgb(255, 255, 255)' ? 'r-18jsvk2' : 'r-vlxjld'

			let modalHeader = document.createElement('div')
			modalHeader.classList.add(textColorClass)
			let botsCount = (this.bots_posts[postUrl]) && Object.prototype.hasOwnProperty.call(this.bots_posts[postUrl], 'bots') ? Object.keys(this.bots_posts[postUrl].bots).length : 0
			modalHeader.innerHTML = `<span style="flex-grow: 10; padding-left: 2em; padding-right: 2em;"><h2>Bots ${botsCount}</h2></span>`
			modalHeader.style = 'display: flex;'
			modalWindow.appendChild(modalHeader)

			let closeButton = document.createElement('button')
			closeButton.setAttribute('type', 'button')
			closeButton.setAttribute('id', 'close-bots-list')
			modalHeader.classList.add(textColorClass)
			closeButton.innerHTML = '<svg viewBox="0 0 24 24" style="'+iconStyles+'" aria-hidden="true"><g><path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>'
			closeButton.style = 'flex-grow: 1; top: 1em; right: 1em; cursor: pointer; background: none; outline: none; border: none; align-self: self-start;'
			closeButton.color = 'rgb(239, 243, 244)'

			closeButton.addEventListener('click', () => {
				this.closeBotsList()
			})
			modalHeader.appendChild(closeButton)

			let modalContent = document.createElement('div')
			modalContent.classList.add('r-18jsvk2')
			modalContent.classList.add('r-vlxjld')
			modalContent.classList.add('posts')
			if ((this.bots_posts[postUrl]) && Object.prototype.hasOwnProperty.call(this.bots_posts[postUrl], 'bots') && Object.keys(this.bots_posts[postUrl].bots).length > 0) {
				Object.keys(this.bots_posts[postUrl].bots).map(bot => {
					let botPosts = document.createElement('div')
					botPosts.innerHTML = `<span background: white; border-radius: 10px; color: black;>${bot}: </span>`
					botPosts.style.paddingBottom = '2em'
					this.bots_posts[postUrl].bots[bot].forEach(url => {
						let post = document.createElement('article')
						post.innerHTML = `<a ${url === window.location.href.replace(window.location.hash, '') ? 'style="background-color: rgba(255, 255, 255, 0.2);"' : ''}href="${url}#bots_window">${url.replace(/https:\/\/twitter.com\/.*\/status\//, '')}</a>`
						botPosts.appendChild(post)
					})
					modalContent.appendChild(botPosts)
				})
			} else modalContent.innerHTML = '<span><h2>Ничего нет...</h2></span>'
			modalWindow.appendChild(modalContent)
		}
	},
	closeBotsList () {
		let modal = document.querySelector('[id="bots-list"]')
		document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010').style.filter = 'blur(0px)'
		document.querySelector('html').style.overflow = 'auto scroll'
		
		document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010').setAttribute('aria-hidden', false)
		if (modal) modal.remove()
		if (document.querySelector('[id="bots-list-window"]')) document.querySelector('[id="bots-list-window"]').remove()
	},
	hideBotList () {
		let modal = document.querySelector('[id="bots-list"]')
		document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010').style.filter = 'blur(0px)'
		document.querySelector('html').style.overflow = 'auto scroll'
		document.querySelector('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010').setAttribute('aria-hidden', false)
		let modalWindow = modal.querySelector('div')
		document.querySelector('[role="navigation"]').appendChild(modalWindow)
		setTimeout(() => modalWindow.scrollIntoView({ alignToTop: true }), 500)
		modal.remove()
	},
	injectBotsCounterToTweet () {
		const iconStyles = 'width: 20px; height: 20px; fill: currentColor;'
		const botIcon = '<svg style="'+iconStyles+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><g><path d="M320 0c17.7 0 32 14.3 32 32V96H480c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40s40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></g></svg>'
		document.querySelectorAll('article[tabindex="0"]').forEach(rootTweet => {
			let navSection = rootTweet.querySelector('div[role=group]')
			let botsCounter = rootTweet.querySelector('.bots-counter')
			let replieLink = rootTweet.querySelectorAll('a[href]')[3].href
			if (!botsCounter) {
				botsCounter = document.createElement('div')
				navSection.appendChild(botsCounter)
				botsCounter.addEventListener('click', () => {
					window.localStorage.setItem('bots_posts', JSON.stringify(this.bots_posts))
					this.showBotsList(replieLink)
				})
			}
			let botsCount = (this.bots_posts[replieLink]) && Object.prototype.hasOwnProperty.call(this.bots_posts[replieLink], 'bots') ? Object.keys(this.bots_posts[replieLink].bots).length : 0
			botsCounter.innerHTML = `<div title="${replieLink}" class="bots-counter css-1dbjc4n r-18u37iz r-1h0z5md"><div aria-label="${botsCount} Bots" role="button" tabindex="0" class="css-18t94o4 css-1dbjc4n r-1777fci r-bt1l66 r-1ny4l3l r-bztko3 r-lrvibr" data-testid="bots"><div dir="ltr" class="css-901oao r-1awozwy r-115tad6 r-6koalj r-37j5jr r-a023e6 r-16dba41 r-1h0z5md r-rjixqe r-bcqeeo r-o7ynqc r-clp7b1 r-3s2u2q r-qvutc0" style=""><div class="css-1dbjc4n r-xoduu5"><div class="css-1dbjc4n r-1niwhzg r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-1ny4l3l r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div>
			${botIcon}
			</div><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transform: translate3d(0px, 0px, 0px); transition-property: transform; transition-duration: 0.3s;"><span class="css-901oao css-16my406 r-poiln3 r-n6v787 r-1cwl3u0 r-1k6nrdp r-1e081e0 r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${botsCount}</span></span></span></div></div></div></div>`
		})
	},
	injectBotsCounterToThread () {
		let rootTweet = document.querySelector('article[tabindex="-1"]') // 'article > div > div > div > div > div[role=group] > div'
		if (rootTweet) {
			let navSection = rootTweet.querySelector('div[role=group] div')
			let botsCounter = document.querySelector('[id="bots-section"]')
			if (!botsCounter) {
				navSection.childNodes[navSection.childNodes.length-1].classList.add('r-1mf7evn')
				botsCounter = document.createElement('div')
				navSection.appendChild(botsCounter)
				let replieLink = rootTweet.querySelectorAll('a[href]')[3].href
				botsCounter.addEventListener('click', () => {
					window.localStorage.setItem('bots_posts', JSON.stringify(this.bots_posts))
					this.showBotsList(replieLink)
				})
				let botsCount = (this.bots_posts[replieLink]) && Object.prototype.hasOwnProperty.call(this.bots_posts[replieLink], 'bots') ? Object.keys(this.bots_posts[replieLink].bots).length : 0

				botsCounter.innerHTML = '<div id="bots-section" class="css-1dbjc4n"><div class="css-1dbjc4n"><a dir="auto" role="link" class="css-4rbku5 css-18t94o4 css-901oao r-vlxjld r-1loqt21 r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0"><div class="css-1dbjc4n r-xoduu5 r-1udh08x"><span data-testid="app-text-transition-container" style="transform: translate3d(0px, 0px, 0px); transition-property: transform; transition-duration: 0.3s;"><span class="css-901oao css-16my406 r-poiln3 r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-qvutc0"><span id="bots-counter" class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">'+botsCount+'</span></span></span></div> <span class="css-901oao css-16my406 r-115tad6 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Bots</span></span></a></div></div>'
			}
		}
	},
	botsUpdated () {
		let botsCounter = document.querySelector('[id="bots-counter"]')
		// if (botsCounter) botsCounter.innerText = this.botsCount
	}
}

window.addEventListener('load', function () {
	let injectBotsCounterToThread = new injectionManager(bots.injectBotsCounterToThread, bots)
	let injectBotsCounterToTweet = new injectionManager(bots.injectBotsCounterToTweet, bots)
	if (window.location.hash === '#bots_window') {
		this.setTimeout(() => {
			bots.bots_posts = JSON.parse(window.localStorage.getItem('bots_posts'))
			bots.currentPostBots = window.localStorage.getItem('currentPostBots')
			bots.lastLinkOpened = window.localStorage.getItem('lastLinkOpened')
			bots.showBotsList(bots.currentPostBots)
			bots.hideBotList()
		}, 1000)
	}
})

/* отображение кол-ва ботов ==== конец */

async function commonImporter()
{
	return await import((chrome.runtime.getURL || chrome.extension.getURL)("common_impex.js"));
}

var prepackaged_labels={};

var webHostedLabelsCached = {};

async function retrieveLabelsFromStorage()
{
	retrievedLabels=await (await commonImporter()).retrieveItemFromStorage('webHostedLabels', {});

	return retrievedLabels;
}


async function initializeCachedLabelsFromStorage()
{
	const labelsFromStorage = await retrieveLabelsFromStorage();
	webHostedLabelsCached = Object.assign({}, labelsFromStorage);
}

async function updateCachedLabelsOnStorageChange(changes, area) {

  const changedItems = Object.keys(changes);

	if ((area == "local") &&
		(Object.keys(changes).includes('webHostedLabels')))
	{
		console.log("Local changes in Labels:");

// 		const newLabels = await retrieveWebHostedLabels();
		const newLabels = changes['webHostedLabels'].newValue;
				
		webHostedLabelsCached = Object.assign({}, newLabels);
	}

	//// Debug-only output:
	// for (const item of changedItems) {
	// 	console.log(`${item} has changed:`);
	// 	console.log("Old value: ", changes[item].oldValue);
	// 	console.log("New value: ", changes[item].newValue);
	// }
}

chrome.storage.onChanged.addListener(updateCachedLabelsOnStorageChange);



async function markUponStorageReady()
{
	await initializeCachedLabelsFromStorage();
/////	console.log("Storage ready, proceeding to marking tweets")
	markTweets();
}



function loadPrepackagedLabels()
{

  var rUrl = chrome.runtime.getURL('assets/labels.json');
  
  fetch(rUrl).then((response) => {
    return response.json();
  })
  .then((fileContent) => {
    prepackaged_labels=fileContent;
  })
  .catch((cause) => console.log(cause));
}


function setStyle(divElement, style)
{
	divElement.innerHTML = '<style>'+style+'</style>'
}

function addStyle(s)
{
	var d = document.createElement('div')
	
	if(s) setStyle(d,s)
	
	return document.body.appendChild(d)
}



// добавляем стили для пометки ботов

// reduced-contrast style for tweet bodies posted by bots
s = '.bot_tweet_highlight .bot_text { color: #808080; }'
addStyle(s)


// стиль для пометки красноватым фоном твитов от ботов
tweetBackgroundStyle=addStyle()

function defineTweetBackgroundStyle()
{
	// dark mode: <meta name="theme-color" content="#1C2938">
	// light mode: <meta name="theme-color" content="#FFFFFF">
	dark_mode = ! (document.querySelector(
		":root > head > meta[name=theme-color]")
		.getAttribute("content").toUpperCase() == "#FFFFFF")

	if (dark_mode)
		var s = '.bot_tweet_highlight { background: #4b3333 !important; }'	// dark
	else
		var s = '.bot_tweet_highlight { background: #FEE !important; }'		// light

	setStyle(tweetBackgroundStyle, s)
}

 

function normalizedPathname()
{
	// normalize '/username/[with_replies]' to 'username'
	loc=document.location
	return (loc.pathname+loc.search).substring(1).replace("/with_replies","")
}

function isStatusView()
{
	path=document.location.pathname
	return path.includes("/status/") && 
 		! path.startsWith("/search")
}

function isProfileView()
{
	pathWithRepliesRemoved=normalizedPathname()
	userNameMatch=pathWithRepliesRemoved
		.match(screennameRegex)

	return (document.location.search=="") && 
		(! pathWithRepliesRemoved.includes("/")) &&
		(userNameMatch) &&
		(userNameMatch[0]==pathWithRepliesRemoved)
}




function markTweets()
{
	if (isStatusView() || isProfileView() )
	{
		defineTweetBackgroundStyle()

		var a=document.querySelectorAll('article[role=article]');
		// In conversation view, works both for focused tweet and
		// for parent / child replies of the focused tweet.
			
		highlight_tweets=isStatusView()

		var i, x, t, linksInsideTweet
		for (i = 0; i < a.length; i++)

			// process only tweets not processed in earlier passes			
			if (!a[i].dataset.mt_is_upd)
			{
				t = a[i]
				// But don't mark it as processed if it contains no link:
				// e.g. if tweet is under extra click:
				// "Show additional replies" or similar
				linksInsideTweet = t.querySelector('a[href]')

				if (!(linksInsideTweet === null))
				{
					
					x = linksInsideTweet.getAttribute('href').substring(1)
					
					
					isRed = ((webHostedLabelsCached[x]=='red') ||
										(prepackaged_labels[x]=='red'))
					
					isYellow = ((webHostedLabelsCached[x]=='yellow') ||
										(prepackaged_labels[x]=='yellow'))

					if ((isRed || isYellow) && highlight_tweets)
					{
						label=isRed?"БОТ:" :isYellow?"⚠️":""
						
						// highlight all tweets shown on the page
						botCaption = document.createElement("span")
						botCaption.innerHTML=label+"&nbsp;"
						botCaption.style.color = 'red'

						// дописываем "БОТ: " перед именем автора твита
						fullname=t.querySelector("span")
						
						fullname.prepend(botCaption)
						
						elementToHighlight = t.parentNode
						//// "Highlight tweets only if they are not retweeted-by,
						//// no matter who retweeted or who posted the original tweet."
						////
						//// In case of retweet, only username of retweeting user
						//// is prepended, not username of original tweet's author.
						////
						//// How it should ideally work:
						//// - instead of parent node, two child nodes should be highlighted:
						////   (1) username,
						////   (2) tweet body
						////
						//// - bot/not bot should be determined based on node always containing
						////   username of original tweet's author
						////
						//// - it is much more important to highlight when the original
						////   tweet's author is bot, not when the account retweeted it is
						//// 
						//// - the above logic will also highlight bot-created pinned tweet

						if (isRed && (elementToHighlight.
							//// "Username retweeted" caption above original tweet is empty
							querySelector(
							":scope > article > div > div > div > div")
							.innerText=="" ))
						{
							// let text = t.childNodes[0].innerText()

							// подсвечиваем весь твит стилем bot_tweet_highlight
							elementToHighlight.className+=" bot_tweet_highlight"

							// reduce contrast for tweet text
							tweetTextselector =
								// - for focused tweet:
								':scope > div > div > span' + ', ' +
								// - for parent / child replies of the focused tweet
								':scope > div > div > div > div > span'
							
							tweetTxts = t.querySelectorAll(tweetTextselector)
							tweetTxts.forEach(
								function(element) {
									element.className='bot_text ' + element.className;
								});
						}
					}
					
					// Mark tweet as processed to skip in subsequent passes
					t.dataset.mt_is_upd = 1
				}
			}
	}
	// repeat every 0.1 seconds
	setTimeout(markTweets, 100);
}


loadPrepackagedLabels();

markUponStorageReady();
