// @flow strict-local

const { Transformer } = require("@parcel/plugin");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const semver = require("semver");

module.exports = (new Transformer({
	canReuseAST({ ast }) {
		return ast.type === "babel" && semver.satisfies(ast.version, "^7.0.0");
	},

	async transform({ asset }) {
		const ast /*: BabelNodeFile */ =
			(await asset.getAST())?.program ?? parse(await asset.getCode());

		let assets = [asset];

		let i = 0;
		traverse(ast, {
			TaggedTemplateExpression(path) {
				let { node } = path;
				if (
					t.isIdentifier(node.tag, { name: "css" }) &&
					node.quasi.quasis.length === 1
				) {
					let content = node.quasi.quasis[0].value.cooked;
					let uniqueKey = `${asset.id}${i}`;

					assets.push({
						type: "css",
						uniqueKey,
						content,
					});
					let placeholder = asset.addDependency({
						specifier: uniqueKey,
						specifierType: "esm",
						bundleBehavior: "inline",
						pipeline: "inline-literal",
					});

					// $FlowFixMe[prop-missing]
					node.quasi.quasis[0] = t.TemplateElement({
						raw: `"${placeholder}"`,
					});
				}
			},
		});

		asset.setAST({
			type: "babel",
			version: "7.0.0",
			program: ast,
		});

		return assets;
	},
}) /*: Transformer */);
