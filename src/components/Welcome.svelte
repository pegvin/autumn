<script></script>

<div id="CodeEditorWelcome">
	<div class="text">
		<h1>
			Autumn
			<img class="CodeEditorLogo" src="../public/icon.png" alt="">
		</h1>
		<p>A Code Editor</p>
	</div>
</div>

<style>
	#CodeEditorWelcome {
		z-index: 999;
		color: var(--fg);
		background-color: var(--bg);
		position: absolute;
		top: 0; left: 0;
		width: 100%; height: 100%;
	}

	#CodeEditorWelcome div.text {
		z-index: 10;
		position: absolute;
		bottom: 80px;
		right: 60px;
		text-align: right;
	}
	#CodeEditorWelcome div.text h1 {
		font-size: 2rem;
	}
	#CodeEditorWelcome div.text p {
		font-size: 1.9rem;
	}
	#CodeEditorWelcome .CodeEditorLogo {
		height: 1.8rem;
		width: 1.8rem;
	}
</style>