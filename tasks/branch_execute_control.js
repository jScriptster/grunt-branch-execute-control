/*
 * grunt-branch-execute-control
 * https://github.com/jScriptster/grunt-branch-execute-control
 *
 * Copyright (c) 2014 jScriptster
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('branch_execute_control', '...', function() {
	var util = require('util');

	var spawn = grunt.util.spawn,
		doneFn = this.async(),
		blacklist,
		whitelist;

	if (typeof this.data === 'string') {
		whitelist = [this.data];
	} else if (util.isArray(this.data) === true) {
		whitelist = this.data;
	} else if (typeof this.data === 'object') {
		whitelist = this.data.whitelist;
		blacklist = this.data.blacklist;
	}

	spawn({
		cmd: 'git',
		args: ['rev-parse', '--abbrev-ref', 'HEAD']
	}, function (err, result, code) {
		var branchName = result.stdout,
			isAllowed = true;

		if (util.isArray(whitelist) === false && util.isArray(blacklist) === false) {
			grunt.log.errorlns('No whitelist and no blacklist defined!');
			doneFn(false);
			return;
		}

		grunt.log.oklns('Current branch-name: ' + branchName);

		grunt.log.oklns('Used whitelist: ' +
			(util.isArray(whitelist) ? (whitelist.length === 0 ? 'Empty whitelist'
				: '[' + whitelist + ']') : 'No whitelist'));

		grunt.log.oklns('Used blacklist: ' +
			(util.isArray(blacklist) ? (blacklist.length === 0 ? 'Empty blacklist'
				: '[' +  blacklist + ']') : 'No blacklist'));

		if (util.isArray(whitelist) === true && whitelist.indexOf(branchName) === -1) {
			isAllowed = false;
			grunt.log.errorlns('Your current branch "' + branchName + '" is not registered on the whitelist!');
		}

		if (util.isArray(blacklist) === true && blacklist.indexOf(branchName) > -1) {
			isAllowed = false;
			grunt.log.errorlns('Your current branch "' + branchName + '" is registered on the backlist!');
		}

		if (isAllowed === true) {
			doneFn(true);
		} else {
			doneFn(false);
		}
	});
  });
};
