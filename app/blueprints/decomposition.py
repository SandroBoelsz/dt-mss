from flask import Blueprint, render_template

decomposition_bp = Blueprint('decomposition', __name__, url_prefix='/decomposition')


@decomposition_bp.route('/monolithic-container')
def monolithicContainer():
    desc = """
    Components identified as <strong>monolithic containers</strong> are preserved as self-contained execution units. 
    In accordance with VRE constraints, these components can be directly containerized.
    Each container bundles all internal dependencies, tools, and runtime environments required for execution.

    <br><br>
    <strong>Inputs and outputs</strong> are either implicit (such as mounted directories or environment variables) or 
    explicitly passed through standardized data mounts or command-line arguments. No internal restructuring is required at this stage.

    <br><br>
    <strong>Decomposition steps for monolithic containers:</strong>
    <ol>
        <li><strong>Identify entrypoint(s):</strong> Determine the primary executable(s) or script(s) that initiate the component.</li>
        <li><strong>Verify dependencies:</strong> Ensure all required libraries, files, runtime engines (e.g., R, NetLogo), and system-level packages are included. 
        Dependencies should be reviewed and extended as needed to guarantee completeness.</li>
    </ol>
    """

    return render_template('decomposition.html', viewpoint="Monolithic Container", description=desc)

@decomposition_bp.route('/fine-grained')
def fineGrained():
    desc = """test"""
    
    return render_template('decomposition.html', viewpoint="Fine-grained Components", description=desc)

@decomposition_bp.route('/coarse-grained')
def coarseGrained():
    desc = """test"""
    
    return render_template('decomposition.html', viewpoint="Coarse-grained Components", description=desc)
