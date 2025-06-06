from flask import Blueprint, render_template, request, redirect, url_for, flash

viewpoints_bp = Blueprint('viewpoints', __name__, url_prefix='/viewpoints')

components = [
    {
        'name': 'Simulation Input UI',
        'role': 'Provides the interface to input simulation parameters',
        'interfaces': 'Web application GUI',
        'dependencies': 'Parameter schema, default values'
    },
    {
        'name': 'Simulation Engine',
        'role': 'Processes input parameters and runs simulations',
        'interfaces': 'API endpoints for simulation execution',
        'dependencies': 'Simulation algorithms, computational resources'
    },
    {
        'name': 'Data Storage',
        'role': 'Stores simulation results and metadata',
        'interfaces': 'Database connections, file storage systems',
        'dependencies': 'Database schema, storage capacity'
    },
    {
        'name': 'Visualization Module',
        'role': 'Generates visual representations of simulation results',
        'interfaces': 'Web-based visualization tools, API for data retrieval',
        'dependencies': 'Visualization libraries, data formats'
    }
]

description = """
This viewpoint captures the scientific intent of the DT and identifies candidate
 reusable components
 from a domain-specific research perspective using a UML Use Case diagram as its main model.
 In order for this application to support you during the Science Viewpoint, you need to create and
 upload a UML Use Case diagram.
 This Use Diagram should be created based on identified end-users and their use cases.
 More infomation about a UML Use Case diagram can be found"""

url = "https://www.geeksforgeeks.org/use-case-diagram/"


@viewpoints_bp.route('/science/artifact')
def scienceArtifact():
    return render_template('file_input.html', viewpoint="Science", description=description, url=url)


@viewpoints_bp.route('/science/analysis')
def scienceAnalysis():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/information')
def information():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/computational')
def computational():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/engineering')
def engineering():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/technology')
def technology():
    return render_template('viewpoints.html', components=components)


@viewpoints_bp.route('/add-component', methods=['POST'])
def add_component():
    name = request.form.get('name')
    role = request.form.get('role')
    interfaces = request.form.get('interfaces')
    dependencies = request.form.get('dependencies')
    if name and role and interfaces and dependencies:
        components.append({
            'name': name,
            'role': role,
            'interfaces': interfaces,
            'dependencies': dependencies
        })
    return redirect(request.referrer)


@viewpoints_bp.route('/delete-component/<int:index>', methods=['POST'])
def delete_component(index):
    if 0 <= index < len(components):
        components.pop(index)
    return redirect(request.referrer)


@viewpoints_bp.route('/upload-artifact/<string:viewpoint>', methods=['POST'])
def upload_artifact(viewpoint):
    if 'diagram' not in request.files or request.files['diagram'].filename == '' \
            or viewpoint.lower() not in ['science', 'information', 'computational', 'engineering', 'technology']:
        return redirect(url_for('home.home'))

    return redirect(url_for(f"viewpoints.{viewpoint.lower()}Analysis"))
