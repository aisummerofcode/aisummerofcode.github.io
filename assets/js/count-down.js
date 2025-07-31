/***
 * Updated version of the countdown script
 * The original version of this script creates a countdown, sets a cookie to 
 * capture user time data, and injects user IP to enable 
 * persistent countdown implementation. 
 * 
 * On the original script, the timer retrieves the declared time value 
 * and appends it to the time when the cookie is first captured.
 * 
 * When countdown reaches zero, timer is destroyed and 
 * capture loop restarts for half the original time value
 * 
 * The original implementation has now been moved to 
 * a different file /count-down-cookie.js
 * 
 */


// Countdown Implementation

'use strict';

function Util(){};
Util.setAttributes = function (el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

(function () {
    class CountDown {
        constructor(element) {
            this.element = element;
            this.labels = this.element.getAttribute('data-labels') ? this.element.getAttribute('data-labels').split(',') : [];
            this.intervalId;

            // set visible labels
            this.setVisibleLabels();

            //create countdown HTML
            this.createCountDown();

            //store time elements
            this.days = this.element.getElementsByClassName('js-countdown__value--0')[0];
            this.hours = this.element.getElementsByClassName('js-countdown__value--1')[0];
            this.mins = this.element.getElementsByClassName('js-countdown__value--2')[0];
            this.secs = this.element.getElementsByClassName('js-countdown__value--3')[0];
            this.endTime = this.getEndTime();

            //init counter
            this.initCountDown();
        }
        setVisibleLabels() {
            this.visibleLabels = this.element.getAttribute('data-visible-labels') ? this.element.getAttribute('data-visible-labels').split(',') : [];
            this.visibleLabels = this.visibleLabels.map(function (label) {
                return label.trim();
            });
        }
        createCountDown() {
            var wrapper = document.createElement("div");
            Util.setAttributes(wrapper, { 'aria-hidden': 'true', 'class': 'countdown__timer' });

            for (var i = 0; i < 4; i++) {
                var timeItem = document.createElement("span"),
                    timeValue = document.createElement("span"),
                    timeLabel = document.createElement("span");

                timeItem.setAttribute('class', 'countdown__item');
                timeValue.setAttribute('class', 'countdown__value countdown__value--' + i + ' js-countdown__value--' + i);
                timeItem.appendChild(timeValue);

                if (this.labels && this.labels.length > 0) {
                    timeLabel.textContent = this.labels[i].trim();
                    timeLabel.setAttribute('class', 'countdown__label');
                    timeItem.appendChild(timeLabel);
                }

                wrapper.appendChild(timeItem);
            }
            // append new content to countdown element
            this.element.insertBefore(wrapper, this.element.firstChild);
            // this.element.appendChild(wrapper);
        }
        // getEndTime() {
        //     // get number of remaining seconds
        //     if (this.element.getAttribute('data-timer')) {
        //         return Number(this.element.getAttribute('data-timer')) * 1000 + new Date(userStartDate).getTime();
        //     }
        //     else if (this.element.getAttribute('data-countdown')) {
        //         return Number(new Date(this.element.getAttribute('data-countdown')).getTime());
        //     }
        // }
        getEndTime() {
            // Get the target date from data-countdown attribute
            const targetDate = this.element.getAttribute('data-countdown');
            if (targetDate) {
                return new Date(targetDate).getTime();
            }
            return 0; // Fallback if no date is provided
        }
        initCountDown() {
            var self = this;
            this.intervalId = setInterval(function () {
                self.updateCountDown(false);
            }, 1000);
            this.updateCountDown(true);
        }
        updateCountDown() {
            // original countdown function
            // https://gist.github.com/adriennetacke/f5a25c304f1b7b4a6fa42db70415bad2
            
            let newTime = new Date().getTime();
            var time = parseInt((this.endTime - newTime) / 1000), 
                days = 0, 
                hours = 0, 
                mins = 0, 
                seconds = 0;

            if (time <= 0) {
                // Countdown has ended
                clearInterval(this.intervalId);
                this.emitEndEvent();
            } else {
                days = parseInt(time / 86400);
                time = (time % 86400);
                hours = parseInt(time / 3600);
                time = (time % 3600);
                mins = parseInt(time / 60);
                time = (time % 60);
                seconds = parseInt(time);
            }

            // hide days/hours/mins if not available
            //if (bool && days == 0 && this.visibleLabels.indexOf('d') < 0) this.days.parentElement.style.display = "none";
            //if (bool && days == 0 && hours == 0 && this.visibleLabels.indexOf('h') < 0) this.hours.parentElement.style.display = "none";
            //if (bool && days == 0 && hours == 0 && mins == 0 && this.visibleLabels.indexOf('m') < 0) this.mins.parentElement.style.display = "none";
            this.days.textContent = days;
            this.hours.textContent = this.getTimeFormat(hours);
            this.mins.textContent = this.getTimeFormat(mins);
            this.secs.textContent = this.getTimeFormat(seconds);
        }
        getTimeFormat(time) {
            return ('0' + time).slice(-2);
        }
        emitEndEvent(time) {
            var event = new CustomEvent('countDownFinished');
            this.element.dispatchEvent(event);
        }
    }

    // Initialize countdowns on page load
    window.addEventListener('load', function () {
        var countDowns = document.getElementsByClassName('js-countdown');
        for (var i = 0; i < countDowns.length; i++) {
            new CountDown(countDowns[i]);
        }
    });

    //set appropriate variables

    // let today = new Date(),
    // dd = String(today.getDate()).padStart(2, "0"),
    // mm = String(today.getMonth() + 1).padStart(2, "0"),
    // yyyy = today.getFullYear();

    // //init_date
    // todayDate = mm + "/" + dd + "/" + yyyy; //present day

    // //load cookie data, split for IP and date
    // //check if IP address exists in cookie data

    // let user = getCookie("userdata");
    // if (user != "") {
    //     userip = user.slice(0, -10);        //slice for ip
    //     userStartDate = user.slice(-10);    //slice date
    //     if (userip != ""){

    //         // Functions calling
    //         window.addEventListener ('load', function () {
    //             //initialize the CountDown objects
    //     /*        window.setTimeout(() => {*/
    //                 var countDown = document.getElementsByClassName('js-countdown');
    //                 if (countDown.length > 0) {
    //                     for (var i = 0; i < countDown.length; i++) {
    //                         (function (i) {
    //                             new CountDown(countDown[i]);
    //                         })(i);
    //                     }
    //                 }
    //       /*      }, 1000);*/

    //         });

    //     }
    // }
    
}());