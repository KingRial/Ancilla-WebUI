module.exports = {
	sSVNRoot: _sSVNRoot,
	sSrcRoot: _sSourceRoot,
	sDevelopmentRoot: _sDevelopmentRoot,
	sReleaseRoot: _sReleaseRoot,
	sSrcWebRoot: _sSrcWebRoot,
	sDevelopmentWebRoot: _sDevelopmentWebRoot,
	sReleaseWebRoot: _sReleaseWebRoot,
	sFilterJS: _sFilterJS,
	sFilterHTML: _sFilterHTML,
	sFilterPHP: _sFilterPHP,
	sFilterCSS: _sFilterCSS,
	sFilterApps: _sFilterApps,
	sFilterAll: _sFilterAll,
	//Source
	aFilterSrcJS: [ _sSrcWebRoot + _sFilterJS, '!' + _sSrcWebRoot + '/Apps/**' ],
	aFilterSrcHTML: [ _sSrcWebRoot + _sFilterHTML, '!' + _sSrcWebRoot + '/Apps/**' ],
	aFilterSrcPHP: [ _sSrcWebRoot + _sFilterPHP ],
	aFilterSrcCSS: [ _sSrcWebRoot + _sFilterCSS, '!' + _sSrcWebRoot + '/Apps/**' ],
	aFilterSrcApps: [ _sSrcWebRoot + _sFilterApps, '!' + _sSrcWebRoot + '/Apps/**' ],
	aFilterSrcAll: [ _sSrcWebRoot + _sFilterAll, '!' + _sSrcWebRoot + '/Apps/**' ],
	//Development
	aFilterDevelopmentJS: [ _sDevelopmentRoot + _sFilterJS ],
	aFilterDevelopmentHTML: [ _sDevelopmentRoot + _sFilterHTML ],
	aFilterDevelopmentPHP: [ _sDevelopmentRoot + _sFilterPHP ],
	aFilterDevelopmentCSS: [ _sDevelopmentRoot + _sFilterCSS ],
	aFilterDevelopmentApps: [ _sDevelopmentRoot + _sFilterApps ],
	aFilterDevelopmentAll: [ _sDevelopmentRoot + _sFilterAll ]
};
