from flask import Flask, render_template
import os
import json

PEOPLE_FOLDER = os.path.join('static', 'images')
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = PEOPLE_FOLDER

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.route('/')
@app.route('/index')
def show_index():
    with open(os.path.join(os.getcwd(),'values.json')) as f:
        data = json.load(f)
        print(data['map'])
        if(data['map']==False):
            image = 'no_map.PNG'
        else:
            image='map.png'
        if(data['map_complete']==True):
            image = 'map1.png'
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], image)
    return render_template("index.html", user_image = full_filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)